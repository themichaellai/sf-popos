import * as React from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { PoposInfo } from '../types';

const rowStyles = StyleSheet.create({
  row: {
    padding: 15,
  },
});

const renderRow = (popos: PoposInfo) => (
  <TouchableHighlight style={rowStyles.row}>
    <Text>
      {popos.name}
    </Text>
  </TouchableHighlight>
);

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
  poposList: Array<PoposInfo>,
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
        renderRow={renderRow}
        renderSeparator={renderSeparator}
        dataSource={this.state.dataSource}
      />
    );
  }
}
