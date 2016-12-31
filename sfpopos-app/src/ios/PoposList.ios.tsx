import * as R from 'ramda';
import * as React from 'react';
import {
  ListView,
  Navigator,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { PoposInfo } from '../types';

import { PoposDetail } from './PoposDetail.ios';

const rowStyles = StyleSheet.create({
  row: {
    padding: 15,
  },
});

const renderRow = R.curry((navigator: Navigator, popos: PoposInfo) => {
  const onPress = () => navigator.push({
    component: PoposDetail,
    title: popos.name,
    index: 1,
    passProps: {
      popos: popos,
    },
  });
  return (
    <TouchableHighlight
      style={rowStyles.row}
      onPress={onPress}>
      <Text>
        {popos.name}
      </Text>
    </TouchableHighlight>
  );
});

const renderSeparator = (sectionId: number, rowId: number) => (
  <View
    key={`${sectionId}-${rowId}`}
    style={{
      backgroundColor: '#EEEEEE',
      height: 1,
      margin: 10,
    }}
  />
);

export interface Props {
  poposList: Array<PoposInfo>;
  navigator: Navigator;
};

interface State {
  dataSource: any,
};

export class PoposList extends React.Component<Props, State> {
  constructor(props: Props) {
    super();

    const dataSource = (new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })).cloneWithRows(props.poposList);
    this.state = { dataSource };
  }

  state: State;

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(nextProps.poposList),
    });
  }

  props: Props;

  render() {
    return (
      <ListView
        renderRow={renderRow(this.props.navigator)}
        renderSeparator={renderSeparator}
        dataSource={this.state.dataSource}
      />
    );
  }
}
