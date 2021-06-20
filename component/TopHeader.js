import React, {Component} from "react";
import {Header,Icon} from "react-native-elements";
// Load element Header dan Icon dari Library react-native-element

class TopHeader extends Component {
  render(){
    return(
      <Header
        backgroundColor = "blue"
        leftComponent={
          <Icon name="menu" color="#fff" onPress={() => this.props.navigation.toggleDrawer()} />
        }
        centerComponent={
          {
            text: this.props.title,
            style: {color: "#fff", fontWeight: "bold"}
          }
        }
        statusBarProps={ {barStyle: "light-content"} }
        />
    );
  }
}
export default TopHeader;
