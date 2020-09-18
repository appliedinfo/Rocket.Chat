import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export default  resourceLinks = new Mongo.Collection('rocketchat_resource_links');

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

  Meteor.publish("rocketchat_resource_links", function () {
//   console.log("teggle",TaggedMessages.find())
   return resourceLinks.find();
}); 
Meteor.methods({
'rocketchat_resource_links.insert'(room_id,gitlabLinkList,jiraLinksList,driveLinkList,sheetLinkList,resourceName ){
    resourceLinks.insert({
        room_id,
        gitlabLinkList,
        jiraLinksList,
        driveLinkList,
        sheetLinkList,
        resourceName
  });
},
'rocketchat_resource_links.update'(room_id,gitlabLinkList,jiraLinksList,driveLinkList,sheetLinkList,resourceName ){
  resourceLinks.update({room_id:room_id},{
      room_id,
      gitlabLinkList,
      jiraLinksList,
      driveLinkList,
      sheetLinkList,
  resourceName
});
},

});
