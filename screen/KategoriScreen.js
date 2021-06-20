import React, {Component} from "react";
import {View, ScrollView} from "react-native";
import {ListItem, Button, Input, Overlay, Text, Card, Badge} from "react-native-elements";
import axios from "axios";
import TopHeader from "../component/TopHeader";

const url = "http://172.20.10.2:8080/second-api/public";

class KategoriScreen extends Component {
  constructor() {
    super();
    this.state = {
      kategori: [],
      form_visible : false,
      action : "",
      id_kategori : "",
      nama_kategori : "",
      find: ""
    }
  }
  get_kategori = () => {
    axios.get(url + "/kategori" )
    .then(response => {
      // memasukkan data dari API ke state array kategori
      this.setState({kategori : response.data.kategori});
    })
    .catch(error => {
      alert(error);
    });
  }

  AddKategori = () => {
    this.setState({
      form_visible: true, // jika diset nilai true, maka form akan muncul
      action: "insert",
      id_kategori : "IDS" + Math.floor(Math.random() * 1000),
      nama_kategori: ""
    });
  }

  EditKategori = (item) => {
    this.setState({
      form_visible: true, // jika diset nilai true, maka form akan muncul
      action: "update",
      id_kategorif: item.id_kategori,
      nama_kategori: item.nama_kategori
    });
  }

  Save = () => {
    this.setState({form_visible: false});
    // diset false agar tampilan form disembunyikan
    let form = new FormData();
    form.append("action", this.state.action);
    form.append("id_kategori", this.state.id_kategori);
    form.append("nama_kategori", this.state.nama_kategori);

    axios.post(url + "/kategori/save", form)
    .then(response => {
      alert(response.data.message);
      this.get_kategori(); // refresh data
    })
    .catch(error => {
      console.log(error);
    })
  }

  Drop = (id) => {
    axios.delete(url + "/kategori/drop/" + id)
    .then(response => {
      alert(response.data.message);
      this.get_kategori(); // refresh data
    })
    .catch(error => {
      console.log(error);
    });
  }

  search = (event) => {
    let form = new FormData();
    form.append("find", this.state.find);
    axios.post(url + "/kategori", form)
    .then(response => {
      this.setState({kategori: response.data.kategori});
    })
    .catch(error => {
      console.log(error);
    })
  }

  //fungsi ketika element terpasang / ter-render
  componentDidMount(){
    this.subs = this.props.navigation.addListener("didFocus", () => {
      this.get_kategori();
    });
  }

  //fungsi ketika halaman ini akan beralih
  componentWillUnmount(){
    this.subs.remove();
  }

  render(){
    return(
      <View>
        <TopHeader navigation={this.props.navigation} title="Data kategori" />
        <ScrollView style={{padding:10, height:"80%"}}>
        <Input type="text" name="find" value={this.state.find} onChangeText={(value) => this.setState({find:value})} placeholder="Searching"/>
        <Button title="Cari" onPress={() => this.search()} buttonStyle={{backgroundColor:"orange"}}/>
          {
            this.state.kategori.map((item,index) => (
              <ListItem
                key={index}
                title={
                  <Text style={{color:"green", fontSize:20, fontWeight:"bold"}}>
                  {item.nama_kategori}
                  </Text>
                }
                subtitle={
                  <View>

                    <View style={{flexDirection: "row"}}>

                    <Button containerStyle={{margin:5}} title="Edit" onPress={() => this.EditKategori(item)} />
                    <Button containerStyle={{margin:5, height:7}}
                      buttonStyle={{ backgroundColor: "red"}}

                      title="Hapus" onPress={() => this.Drop(item.id_kategori)} />
                    </View>
                  </View>
                }
                bottomDivider />
            ))
          }
          </ScrollView>
          <Button buttonStyle={{backgroundColor:"green"}}

          title="Tambah kategori" onPress={this.AddKategori} type="solid" containerStyle={{marginBottom:20}} />
          <Overlay
            isVisible={this.state.form_visible}
            onBackdropPress={() => this.setState({from_visible: false})}>
          <ScrollView>
            <Input containerStyle={{margin:2}}
            label="Nama kategori" value={this.state.nama_kategori} onChangeText={(value) => this.setState({nama_kategori:value})} />
            <Button title="Simpan" type="solid" onPress={this.Save} buttonStyle={{backgroundColor:"green"}} />
            </ScrollView>
          </Overlay>
        </View>
    )
  }
}

export default KategoriScreen;
