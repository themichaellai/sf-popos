import * as React from 'react';
import {
  Text,
  View,
} from 'react-native';

import { PoposInfo } from '../types';

interface Props {
  popos: PoposInfo;
  navigator?: Navigator;
};

export class PoposDetail extends React.Component<Props, void> {
  render() {
    const { popos } = this.props;
    return (
      <View>
        <Text>
          {popos.name}
        </Text>
      </View>
    );
  }
};
