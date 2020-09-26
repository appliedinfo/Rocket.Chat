import { Template } from 'meteor/templating';

import { TabBar, fireGlobalEvent } from '../../../../ui-utils';
import './header.html';

Template.header.helpers({
	back() {
		return Template.instance().data.back;
	},
	buttons() {
		return TabBar.getButtons();
	},
});

Template.header.events({
	'click .rc-header__wrap'(){
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
});
