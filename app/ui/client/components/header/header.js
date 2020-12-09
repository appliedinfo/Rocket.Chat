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
	'click .rc-header'(){
		console.log("clicked")
	},
	'click .rc-header__wrap'(){
		
	},
	'click .iframe-toolbar .js-iframe-action'(e) {
		fireGlobalEvent('click-toolbar-button', { id: this.id });
		e.currentTarget.querySelector('button').blur();
		return false;
	},
});
