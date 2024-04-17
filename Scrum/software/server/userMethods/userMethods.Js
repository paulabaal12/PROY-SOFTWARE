import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import Speakeasy from 'speakeasy';
import { check } from 'meteor/check';

Meteor.methods({
  'user.enableTotp'(secret) {
    check(secret, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Meteor.users.update(this.userId, {
      $set: {
        'profile.2fa.secret': secret,
        'profile.2fa.enabled': true
      }
    });
  },

  'user.verifyTotp'({ email, token }) {
    check(email, String);
    check(token, String);

    const user = Accounts.findUserByEmail(email);
    if (!user || !user.profile['2fa'].secret) {
      throw new Meteor.Error('user-not-found', 'User not found or 2FA not set up.');
    }
    const verified = Speakeasy.totp.verify({
      secret: user.profile['2fa'].secret,
      encoding: 'base32',
      token: token
    });
    if (verified) {
      this.setUserId(user._id); // Optional
    }
    return verified;
  },

  'sendVerificationCode'(email) {
    check(email, String);

    const user = Accounts.findUserByEmail(email);
    if (!user) {
      throw new Meteor.Error('user-not-found', 'No user found with this email.');
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    Meteor.users.update(user._id, {
      $set: {
        'profile.2fa.code': verificationCode,
        'profile.2fa.codeExpires': new Date(Date.now() + 30 * 60000)
      }
    });
    try {
      Email.send({
        to: email,
        from: 'yourapp@example.com',
        subject: 'Your Verification Code',
        text: `Your verification code is: ${verificationCode}`
      });
    } catch (error) {
      throw new Meteor.Error('email-failed', 'Failed to send verification email.');
    }
    return true;
  }
});


