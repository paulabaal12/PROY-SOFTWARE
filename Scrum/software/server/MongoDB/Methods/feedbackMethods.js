// MongoDB/feedbackMethods.js

import { Meteor } from 'meteor/meteor';
import { Feedback } from '../collections';

Meteor.methods({
  'feedback.submit'(feedbackData) {
    return Feedback.insert(feedbackData);
  },

  'feedback.getForOrder'(orderId) {
    return Feedback.find({ orderId }).fetch();
  },

  'feedback.getForDriver'(driverId) {
    // Assuming feedback is linked to orders, and orders have a driverId field
    return Feedback.find({ driverId }).fetch();
  },
});
