import * as R from 'ramda';
import * as React from 'react';
import {
  Navigator,
  Route,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PoposInfo } from '../types';

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

interface Props {
  poposList: Array<PoposInfo>;
}

export class PoposListTab extends React.Component<Props, void> {
  constructor() {
    super();
    this._renderScene = this._renderScene.bind(this);
  }

  _renderScene(route: Route, navigator: Navigator) {
    const {
      component: Component,
      passProps,
    } = route;
    if (Component != null) {
      const props = R.defaultTo({}, passProps);
      return (
        <View style={styles.navigatorInner}>
          <Component {...props} />
        </View>
      );
    } else {
      return <View style={styles.navigatorInner} />;
    }
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

    const initialRoute: Route = {
      component: PoposList.PoposList,
      passProps: {
        poposList: this.props.poposList,
      },
      title: 'SF Popos',
      index: 0,
    };

    return (
      <Navigator
        navigationBar={navigationBar}
        initialRoute={initialRoute}
        renderScene={this._renderScene}
      />
    );
  }
}
