import toastr from 'toastr';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { t, roomTypes, handleError } from '../../../../utils';
import { TabBar, fireGlobalEvent, call } from '../../../../ui-utils';
import { ChatSubscription, Rooms, ChatRoom } from '../../../../models';
import { settings } from '../../../../settings';
import { emoji } from '../../../../emoji';
import { Markdown } from '../../../../markdown/client';
import { hasAllPermission } from '../../../../authorization';
import { getUidDirectMessage } from '../../../../ui-utils/client/lib/getUidDirectMessage';
import { Mongo } from 'meteor/mongo'; 
import './headerRoom.html';

export default resourceLinks = new Mongo.Collection('rocketchat_resource_links');
Meteor.subscribe('rocketchat_resource_links');
const getUserStatus = (id) => {
	const roomData = Session.get(`roomData${ id }`);
	return roomTypes.getUserStatus(roomData.t, id);
};

const getUserStatusText = (id) => {
	const roomData = Session.get(`roomData${ id }`);
	return roomTypes.getUserStatusText(roomData.t, id);
};

Template.headerRoom.helpers({
	isDiscussion: () => Template.instance().state.get('discussion'),
	hasPresence() {
		const room = Rooms.findOne(this._id);
		return !roomTypes.getConfig(room.t).isGroupChat(room);
	},
	isDirect() { return Rooms.findOne(this._id).t === 'd'; },
	isToggleFavoriteButtonVisible: () => Template.instance().state.get('favorite') !== null,
	isToggleFavoriteButtonChecked: () => Template.instance().state.get('favorite'),
	toggleFavoriteButtonIconLabel: () => (Template.instance().state.get('favorite') ? t('Unfavorite') : t('Favorite')),
	toggleFavoriteButtonIcon: () => (Template.instance().state.get('favorite') ? 'star-filled' : 'star'),
	uid() {
		return getUidDirectMessage(this._id);
	},
	back() {
		return Template.instance().data.back;
	},
	avatarBackground() {
		const roomData = Session.get(`roomData${ this._id }`);
		if (!roomData) { return ''; }
		return roomTypes.getConfig(roomData.t).getAvatarPath(roomData);
	},
	buttons() {
		return TabBar.getButtons();
	},

	isTranslated() {
		const sub = ChatSubscription.findOne({ rid: this._id }, { fields: { autoTranslate: 1, autoTranslateLanguage: 1 } });
		return settings.get('AutoTranslate_Enabled') && ((sub != null ? sub.autoTranslate : undefined) === true) && (sub.autoTranslateLanguage != null);
	},
	roomName() {
		const roomData = Session.get(`roomData${ this._id }`);
		if (!roomData) { 
			return ''; }

		return roomTypes.getRoomName(roomData.t, roomData);
	},

	secondaryName() {
		const roomData = Session.get(`roomData${ this._id }`);
		if (!roomData) { return ''; }

		return roomTypes.getSecondaryRoomName(roomData.t, roomData);
	},

	roomTopic() {
		const roomData = Session.get(`roomData${ this._id }`);
		if (!roomData || !roomData.topic) { return ''; }

		let roomTopic = Markdown.parse(roomData.topic.replace(/\n/mg, ' '));

		// &#39; to apostrophe (') for emojis such as :')
		roomTopic = roomTopic.replace(/&#39;/g, '\'');

		roomTopic = Object.keys(emoji.packages).reduce((topic, emojiPackage) => emoji.packages[emojiPackage].render(topic), roomTopic);

		// apostrophe (') back to &#39;
		return roomTopic.replace(/\'/g, '&#39;');
	},

	roomIcon() {
		const roomData = Session.get(`roomData${ this._id }`);
		if (!(roomData != null ? roomData.t : undefined)) { return ''; }

		return roomTypes.getIcon(roomData);
	},

	tokenAccessChannel() {
		return Template.instance().hasTokenpass.get();
	},
	encryptionState() {
		const room = ChatRoom.findOne(this._id);
		return settings.get('E2E_Enable') && room && room.encrypted && 'encrypted';
	},

	userStatus() {
		return getUserStatus(this._id) || 'offline';
	},

	userStatusText() {
		const statusText = getUserStatusText(this._id);
		if (statusText) {
			return statusText;
		}

		const presence = getUserStatus(this._id);
		if (presence) {
			return t(presence);
		}

		const oldStatusText = Template.instance().userOldStatusText.get();
		if (oldStatusText) {
			return oldStatusText;
		}

		return t('offline');
	},

	fixedHeight() {
		return Template.instance().data.fixedHeight;
	},

	fullpage() {
		return Template.instance().data.fullpage;
	},

	isChannel() {
		return Template.instance().currentChannel != null;
	},

	isSection() {
		return Template.instance().data.sectionName != null;
	},
	isGitlabLink(){
		const room = Rooms.findOne(this._id);
		 let gitlabItem = resourceLinks.findOne({room_id:this._id})
		const gitlabLink = gitlabItem.gitlabLinkList;
		if(gitlabLink.length>0){
			return true;
		}
		else {
			return false;
		}
	},
	isJiraLink(){
		const room = Rooms.findOne(this._id);
		 let item = resourceLinks.findOne({room_id:this._id})
		const jiraLink = item.jiraLinksList;
		if(jiraLink.length>0){
			return true;
		}
		else {
			return false;
		}
	},
	isDriveLink(){
		const room = Rooms.findOne(this._id);
		 let item = resourceLinks.findOne({room_id:this._id})
		const driveLink = item.driveLinkList;
		if(driveLink.length>0){
			return true;
		}
		else {
			return false;
		}
	},
	isSheetLink(){
		const room = Rooms.findOne(this._id);
		let item = resourceLinks.findOne({room_id:this._id})
	   const sheetLink = item.sheetLinkList;
	   if(sheetLink.length>0){
		   return true;
	   }
	   else {
		   return false;
	   }
	},
	showDropdown(){
		return Session.get("showdrop");
	},
	jiraShowDropdown(){
		return Session.get("showJiradrop");
	},
	driveShowDropdown(){
		return Session.get("showDrivedrop");
	},
	sheetShowDropdown(){
		return Session.get("showsheetdrop");
	},
	gitlabLinkList(){
		const room = Rooms.findOne(this._id);
		let gitlabItem = resourceLinks.findOne({room_id:this._id})
		const gitlabLink = gitlabItem.gitlabLinkList;
	return gitlabLink;
	},
	jiraLinkList(){
		const room = Rooms.findOne(this._id);
		let item = resourceLinks.findOne({room_id:this._id})
		const jiraLinks = item.jiraLinksList;
	return jiraLinks;
	},
	driveLinkList(){
		const room = Rooms.findOne(this._id);
		let item = resourceLinks.findOne({room_id:this._id})
		const driveLinks = item.driveLinkList;
	return driveLinks;
	},
	sheetLinkList(){
		const room = Rooms.findOne(this._id);
		let item = resourceLinks.findOne({room_id:this._id})
		const sheetLinks = item.sheetLinkList;
	return sheetLinks;
	},
	
});

Template.headerRoom.events({

	'click .dropbtn'(event,instance){
		if(Session.get("showdrop") == "block"){
			Session.set("showdrop","none");
		}
		else{
			Session.set("showdrop","block");
			Session.set("showJiradrop","none");
			Session.set("showDrivedrop","none");
			Session.set("showsheetdrop","none");
		}
	},
	'click .jiraDropbtn'(event,instance){
		if(Session.get("showJiradrop") == "block"){
			Session.set("showJiradrop","none");
		}
		else{
			Session.set("showJiradrop","block");
			Session.set("showdrop","none");
			Session.set("showDrivedrop","none");
			Session.set("showsheetdrop","none");
		}
	},
	'click .driveDropbtn'(event,instance){
		if(Session.get("showDrivedrop") == "block"){
			Session.set("showDrivedrop","none");
		}
		else{
			Session.set("showDrivedrop","block");
			Session.set("showJiradrop","none");
			Session.set("showdrop","none");
			Session.set("showsheetdrop","none");
		}
	},
	'click .sheetDropBtn'(event,instance){
		if(Session.get("showsheetdrop") == "block"){
			Session.set("showsheetdrop","none");
		}
		else{
			Session.set("showsheetdrop","block");
			Session.set("showJiradrop","none");
			Session.set("showdrop","none");
			Session.set("showDrivedrop","none");
		}
	},
	'click .dropdown-content'(event,instance){
		    Session.set("showsheetdrop","none");
			Session.set("showJiradrop","none");
			Session.set("showdrop","none");
			Session.set("showDrivedrop","none");
	},
	'click .iframe-toolbar .js-iframe-action'(e) {
		fireGlobalEvent('click-toolbar-button', { id: this.id });
		e.currentTarget.querySelector('button').blur();
		return false;
	},

	'click .js-favorite'(event, instance) {
		event.stopPropagation();
		event.preventDefault();
		event.currentTarget.blur();

		return Meteor.call(
			'toggleFavorite',
			this._id,
			!instance.state.get('favorite'),
			(err) => err && handleError(err),
		);
	},

	'click .js-open-parent-channel'(event, t) {
		event.preventDefault();
		const { prid } = t.currentChannel;
		FlowRouter.goToRoomById(prid);
	},
	'click .js-toggle-encryption'(event) {
		event.stopPropagation();
		event.preventDefault();
		const room = ChatRoom.findOne(this._id);
		if (hasAllPermission('edit-room', this._id)) {
			call('saveRoomSettings', this._id, 'encrypted', !(room && room.encrypted)).then(() => {
				toastr.success(
					t('Encrypted_setting_changed_successfully'),
				);
			});
		}
	},
	'click .rc-header__content.rc-header__block'(event, instance) {
		const { tabBar } = instance.parentTemplate();
		const $flexTab = $('.flex-tab-container .flex-tab');
		Session.set("showsheetdrop","none");
        Session.set("showJiradrop","none");
        Session.set("showdrop","none");
        Session.set("showDrivedrop","none");
		if (tabBar.getState() === 'opened' && (tabBar.getTemplate() === 'channelSettings' || tabBar.getTemplate() === 'membersList')) {
			$flexTab.attr('template', '');
			return tabBar.close();
		}

		if (instance.currentChannel.t !== 'd') {
			$flexTab.attr('template', 'channelSettings');
			tabBar.setData({
				label: 'Room_Info',
				icon: 'info-circled',
			});
			tabBar.open(TabBar.getButton('channel-settings'));
		} else {
			$flexTab.attr('template', 'membersList');
			tabBar.setData({
				label: 'User_Info',
				icon: 'info-user',
			});
			tabBar.open(TabBar.getButton('user-info'));
		}
	},
});

const loadUserStatusText = () => {
	const instance = Template.instance();

	if (!instance || !instance.data || !instance.data._id) {
		return;
	}

	const id = instance.data._id;

	if (Rooms.findOne(id).t !== 'd') {
		return;
	}

	const userId = getUidDirectMessage(id);

	// If the user is already on the local collection, the method call is not necessary
	const found = Meteor.users.findOne(userId, { fields: { _id: 1 } });
	if (found) {
		return;
	}

	Meteor.call('getUserStatusText', userId, (error, result) => {
		if (!error) {
			instance.userOldStatusText.set(result);
		}
	});
};

Template.headerRoom.onCreated(function() {
	this.state = new ReactiveDict();

	const isFavoritesEnabled = () => settings.get('Favorite_Rooms');

	const isDiscussion = (rid) => {
		const room = ChatRoom.findOne({ _id: rid });
		return !!(room && room.prid);
	};

	this.autorun(() => {
		const { _id: rid } = Template.currentData();

		this.state.set({
			rid,
			discussion: isDiscussion(rid),
		});

		if (!this.state.get('discussion') && isFavoritesEnabled()) {
			const subscription = ChatSubscription.findOne({ rid }, { fields: { f: 1 } });
			this.state.set('favorite', !!(subscription && subscription.f));
		} else {
			this.state.set('favorite', null);
		}
	});

	this.currentChannel = (this.data && this.data._id && Rooms.findOne(this.data._id)) || undefined;

	this.hasTokenpass = new ReactiveVar(false);
	this.userOldStatusText = new ReactiveVar(null);

	if (settings.get('API_Tokenpass_URL') !== '') {
		Meteor.call('getChannelTokenpass', this.data._id, (error, result) => {
			if (!error) {
				this.hasTokenpass.set(!!(result && result.tokens && result.tokens.length > 0));
			}
		});
	}

	loadUserStatusText();
});
