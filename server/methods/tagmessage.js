import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';




var TaggedMessages = new Mongo.Collection('rocketchat_taggedmessages');
// TaggedMessages.allow({
//   insert: function (userId, doc) {
//          return true;
//   },
//   update: function (userId, doc, fieldNames, modifier) {
//          return true;
//   },
//   remove: function (userId, doc) {
//          return true;
//   },
//  fetch : []
// });

Meteor.publish("rocketchat_taggedmessages", function () {
  console.log("tegglea",TaggedMessages.find())
  return TaggedMessages.find();
}); 

Meteor.methods({
  
'rocketchat_taggedmessages.insert'(message,messageId,taggedList ){
  TaggedMessages.insert({
    taggedList,
    message,
    messageId
  });
},
'rocketchat_taggedmessages.update'(message,messageId,taggedList ){
  TaggedMessages.update({messageId:messageId},{
    taggedList,
    message,
    messageId ,
  });
},
'rocketchat_taggedmessages.remove'(messageId){
  TaggedMessages.remove({messageId:messageId})
}
});
    