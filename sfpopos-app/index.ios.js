/* @flow */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  View,
} from 'react-native';

import type { PoposInfo } from './types';

import { PoposListTab } from './ios/PoposListTab.ios';

import poposList from './popos.json';

export default class sfpopos extends Component {
  state = {
    selectedTab: 'list',
  };

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'list'}
          onPress={() => this.setState({ selectedTab: 'list' })}
          title="List">
          <PoposListTab poposList={(poposList: Array<PoposInfo>)} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'map'}
          onPress={() => this.setState({ selectedTab: 'map' })}
          title="Map">
          <View />
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

AppRegistry.registerComponent('sfpopos', () => sfpopos);
