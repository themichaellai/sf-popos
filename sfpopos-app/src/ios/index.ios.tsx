import * as React from 'react';
import {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} from 'react-native';

import { PoposListTab } from './PoposListTab.ios';

import { PoposInfo } from '../types';

var poposList = require('../../popos.json') as Array<PoposInfo> | null;

type TabSelection = 'list' | 'map';

interface State {
  selectedTab: TabSelection;
};

export default class sfpopos extends React.Component<void, State> {
  state = {
    selectedTab: 'list' as TabSelection,
  };

  render() {
    if (poposList == null) {
      return <View><Text>Could not load popos data</Text></View>;
    }
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          selected={this.state.selectedTab === 'list'}
          onPress={() => this.setState({ selectedTab: 'list' })}
          title="List">
          <PoposListTab poposList={poposList} />
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
};
