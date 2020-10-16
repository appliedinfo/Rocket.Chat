import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export default  roomTags = new Mongo.Collection('rocketchat_room_tags');



  Meteor.publish("rocketchat_room_tags", function () {
//   console.log("teggle",TaggedMessages.find())
   return roomTags.find();
}); 
Meteor.methods({
'rocketchat_room_tags.insert'(room_id,roomtagsList ){
    roomTags.insert({
        room_id,
        roomtagsList
  });
},
'rocketchat_room_tags.update'(room_id,roomtagsList ){
    roomTags.update({room_id:room_id},{
      room_id,
      roomtagsList
});
},

});
