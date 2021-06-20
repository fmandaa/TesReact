import React, {Component} from "react";
import {View, ScrollView} from "react-native";
import {ListItem, Button, Input, Overlay, Text, Card, Badge} from "react-native-elements";
import axios from "axios";
import TopHeader from "../component/TopHeader";

const url = "http://172.20.10.2:8080/second-api/public";

class SatuanScreen extends Component {
  constructor() {
    super();
    this.state = {
      satuan: [],
      form_visible : false,
      action : "",
      id_satuan : "",
      nama_satuan : "",
      find: ""
    }
  }
  get_satuan = () => {
    axios.get(url + "/satuan" )
    .then(response => {
      // memasukkan data dari API ke state array satuan
      this.setState({satuan : response.data.satuan});
    })
    .catch(error => {
      alert(error);
    });
  }

  AddSatuan = () => {
    this.setState({
      form_visible: true, // jika diset nilai true, maka form akan muncul
      action: "insert",
      id_satuan : "IDS" + Math.floor(Math.random() * 1000),
      nama_satuan: ""
    });
  }

  EditSatuan = (item) => {
    this.setState({
      form_visible: true, // jika diset nilai true, maka form akan muncul
      action: "update",
      id_satuanf: item.id_satuan,
      nama_satuan: item.nama_satuan
    });
  }

  Save = () => {
    this.setState({form_visible: false});
    // diset false agar tampilan form disembunyikan
    let form = new FormData();
    form.append("action", this.state.action);
    form.append("id_satuan", this.state.id_satuan);
    form.append("nama_satuan", this.state.nama_satuan);

    axios.post(url + "/satuan/save", form)
    .then(response => {
      alert(response.data.message);
      this.get_satuan(); // refresh data
    })
    .catch(error => {
      console.log(error);
    })
  }

  Drop = (id) => {
    axios.delete(url + "/satuan/drop/" + id)
    .then(response => {
      alert(response.data.message);
      this.get_satuan(); // refresh data
    })
    .catch(error => {
      console.log(error);
    });
  }

  search = (event) => {
    let form = new FormData();
    form.append("find", this.state.find);
    axios.post(url + "/satuan", form)
    .then(response => {
      this.setState({satuan: response.data.satuan});
    })
    .catch(error => {
      console.log(error);
    })
  }

  //fungsi ketika element terpasang / ter-render
  componentDidMount(){
    this.subs = this.props.navigation.addListener("didFocus", () => {
      this.get_satuan();
    });
  }

  //fungsi ketika halaman ini akan beralih
  componentWillUnmount(){
    this.subs.remove();
  }

  render(){
    return(
      <View>
        <TopHeader navigation={this.props.navigation} title="Data satuan" />
        <ScrollView style={{padding:10, height:"80%"}}>
        <Input type="text" name="find" value={this.state.find} onChangeText={(value) => this.setState({find:value})} placeholder="Searching"/>
        <Button title="Cari" onPress={() => this.search()} buttonStyle={{backgroundColor:"orange"}}/>
          {
            this.state.satuan.map((item,index) => (
              <ListItem
                key={index}
                title={
                  <Text style={{color:"green", fontSize:20, fontWeight:"bold"}}>
                  {item.nama_satuan}
                  </Text>
                }
                subtitle={
                  <View>

                    <View style={{flexDirection: "row"}}>

                    <Button containerStyle={{margin:5}} title="Edit" onPress={() => this.EditSatuan(item)} />
                    <Button containerStyle={{margin:5, height:7}}
                      buttonStyle={{ backgroundColor: "red"}}

                      title="Hapus" onPress={() => this.Drop(item.id_satuan)} />
                    </View>
                  </View>
                }
                bottomDivider />
            ))
          }
          </ScrollView>
          <Button buttonStyle={{backgroundColor:"green"}}

          title="Tambah satuan" onPress={this.AddSatuan} type="solid" containerStyle={{marginBottom:20}} />
          <Overlay
            isVisible={this.state.form_visible}
            onBackdropPress={() => this.setState({from_visible: false})}>
          <ScrollView>
            <Input containerStyle={{margin:2}}
            label="Nama satuan" value={this.state.nama_satuan} onChangeText={(value) => this.setState({nama_satuan:value})} />
            <Button title="Simpan" type="solid" onPress={this.Save} buttonStyle={{backgroundColor:"green"}} />
            </ScrollView>
          </Overlay>
        </View>
    )
  }
}

export default SatuanScreen;
