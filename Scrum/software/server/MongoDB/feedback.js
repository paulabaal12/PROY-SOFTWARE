// MongoDB/feedback.js

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Feedback = new Mongo.Collection('feedback');

Feedback.schema = new SimpleSchema({
  orderId: { type: String },
  userId: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  comments: { type: String, optional: true },
  createdAt: { type: Date, defaultValue: new Date() },
});

Feedback.attachSchema(Feedback.schema);
