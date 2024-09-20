// server/methods/userMethods.js
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema'; // For input validation

// Define a schema for user inputs
const userSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: false,
    custom() {
      if (!this.value) {
        return 'Email is required';
      }
    }
  },
  password: {
    type: String,
    min: 8,
    optional: false,
    custom() {
      if (this.value.length < 8) {
        return 'Password must be at least 8 characters long';
      }
    }
  }
});

Meteor.methods({
  /**
   * Register a new user with email and password.
   * Includes input validation and detailed error handling.
   */
  'user.register'(email, password) {
    try {
      // Validate inputs using the schema
      userSchema.validate({ email, password });

      // Check if email already exists
      const existingUser = Accounts.findUserByEmail(email);
      if (existingUser) {
        throw new Meteor.Error('email-in-use', 'This email is already registered.');
      }

      // Create user account
      const userId = Accounts.createUser({ email, password });

      return {
        success: true,
        message: 'User registered successfully',
        userId
      };
    } catch (error) {
      // Catch validation errors
      if (error instanceof SimpleSchema.ValidationContext) {
        throw new Meteor.Error('validation-error', 'Validation failed', error.details);
      }

      // Catch specific Meteor errors
      if (error.error === 'email-in-use') {
        throw new Meteor.Error('email-in-use', 'This email is already registered.');
      }

      // Catch all other errors
      throw new Meteor.Error('registration-failed', 'An error occurred during registration', error.reason || error.message);
    }
  },

  /**
   * Login user using email and password.
   * Includes error handling for invalid credentials.
   */
  'user.login'(email, password) {
    try {
      // Validate inputs using the schema
      userSchema.validate({ email, password });

      // Check if user exists
      const user = Accounts.findUserByEmail(email);
      if (!user) {
        throw new Meteor.Error('user-not-found', 'No user found with this email.');
      }

      // Check password
      const passwordCheck = Accounts._checkPassword(user, password);
      if (passwordCheck.error) {
        throw new Meteor.Error('invalid-password', 'Incorrect password.');
      }

      // Return success message
      return {
        success: true,
        message: 'Login successful',
        userId: user._id
      };
    } catch (error) {
      // Catch validation errors
      if (error instanceof SimpleSchema.ValidationContext) {
        throw new Meteor.Error('validation-error', 'Validation failed', error.details);
      }

      // Catch specific Meteor errors
      if (error.error === 'user-not-found') {
        throw new Meteor.Error('user-not-found', 'No user found with this email.');
      }

      if (error.error === 'invalid-password') {
        throw new Meteor.Error('invalid-password', 'Incorrect password.');
      }

      // Catch all other errors
      throw new Meteor.Error('login-failed', 'Login attempt failed', error.reason || error.message);
    }
  },

  /**
   * Update password for a user
   */
  'user.updatePassword'(oldPassword, newPassword) {
    try {
      // Ensure user is logged in
      if (!Meteor.userId()) {
        throw new Meteor.Error('not-authorized', 'You must be logged in to update your password.');
      }

      // Check that new password is valid
      if (newPassword.length < 8) {
        throw new Meteor.Error('invalid-password', 'Password must be at least 8 characters long.');
      }

      // Update the password
      Accounts.changePassword(oldPassword, newPassword);
      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      // Catch all errors
      throw new Meteor.Error('password-update-failed', 'Failed to update password', error.reason || error.message);
    }
  }
});
