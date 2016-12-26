/* @flow */

import React, {
  Component,
} from 'react';
import {
  Navigator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as PoposList from './PoposList.ios';

const styles = StyleSheet.create({
  navigatorBar: {
    backgroundColor: '#F8F8F8',
    height: 60,
  },
  navigatorInner: {
    marginTop: 60,
  },
  titleText: {
    padding: 10,
  },
});

type SceneName = 'list';

type Scene = {
  name: SceneName,
  title: string,
  index: number,
};

const scenes: {[name: SceneName]: Scene} = {
  list: {
    name: 'list',
    title: 'SF Popos',
    index: 0,
  },
};

export class PoposListTab extends Component<void, PoposList.Props, void> {
  constructor() {
    super();
    this._renderScene = this._renderScene.bind(this);
  }

  props: PoposList.Props;

  _renderScene({ name }: Scene) {
    if (name === 'list') {
      return (
        <View style={styles.navigatorInner}>
          <PoposList.PoposList poposList={this.props.poposList} />
        </View>
      );
    }
    return (<View />);
  }

  render() {
    const navigationBar = (
      <Navigator.NavigationBar
        routeMapper={{
          LeftButton: () => <View />,
          RightButton: () => <View />,
          Title: ({ title }, navigator, index, navState) =>
            <Text style={styles.titleText}>{title}</Text>,
        }}
        style={styles.navigatorBar}
      />
    );

    return (
      <Navigator
        navigationBar={navigationBar}
        initialRoute={scenes.list}
        renderScene={this._renderScene}
      />
    );
  }
}
