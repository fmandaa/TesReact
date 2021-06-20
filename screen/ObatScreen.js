import React, {Component} from "react";
import {View, ScrollView, Picker} from "react-native";
import {ListItem, Button, Input, Overlay, Text, Card, Badge} from "react-native-elements";
import axios from "axios";
import TopHeader from "../component/TopHeader";

const url = "http://172.20.10.2:8080/second-api/public";

class ObatScreen extends Component {
  constructor() {
    super();
    this.state = {
      obat: [],
      form_visible : false,
      action : "",
      id_obat: "",
      nama_obat: "",
      stok: "",
      harga: "",
      satuan: [],
      id_satuan: "",
      margin_1: "",
      margin_2: "",
      kategori: [],
      id_kategori : "",
      find: ""
    }
  }

  get_obat = () => {
    axios.get(url + "/obat" )
    .then(response => {
      // memasukkan data dari API ke state array kategori
      this.setState({obat : response.data.obat});
    })
    .catch(error => {
      alert(error);
    });
  }

  get_satuan = () => {
    axios.get(url + "/satuan" )
    .then(response => {
      // memasukkan data dari API ke state array kategori
      this.setState({
        satuan : response.data.satuan,
        id_satuan: response.data.satuan[0].id_satuan
      });
    })
    .catch(error => {
      alert("kategori:" + error);
    })
  }

  get_kategori = () => {
    axios.get(url + "/kategori" )
    .then(response => {
      // memasukkan data dari API ke state array kategori
      this.setState({
        kategori : response.data.kategori,
        id_kategori: response.data.kategori[0].id_kategori
      });
    })
    .catch(error => {
      alert("kategori:" + error);
    })
  }

  AddObat = () => {
    this.setState({
      form_visible: true, // jika diset nilai true, maka form akan muncul
      action: "insert",
      id_obat : "IDS" + Math.floor(Math.random() * 1000),
      nama_obat: "",
      harga: "",
      stok: "",
      margin_1: "",
      margin_2: ""
    });
  }

  EditObat = (item) => {
    this.setState({
      form_visible: true, // jika diset nilai true, maka form akan muncul
      action: "update",
      id_obat : item.id_obat,
      nama_obat: item.nama_obat,
      harga: item.harga,
      stok: item.stok,
      id_kategori: item.id_kategori,
      id_satuan: item.id_satuan,
      margin_1: item.margin_1,
      margin_2: item.margin_2
    });
  }

  Save = () => {
    this.setState({form_visible: false});
    // diset false agar tampilan form disembunyikan
    let form = new FormData();
    form.append("action", this.state.action);
    form.append("id_obat", this.state.id_obat);
    form.append("id_satuan", this.state.id_satuan);
    form.append("id_kategori", this.state.id_kategori);
    form.append("stok", this.state.stok);
    form.append("nama_obat", this.state.nama_obat);
    form.append("harga", this.state.harga);
    form.append("margin_1", this.state.margin_1);
    form.append("margin_2", this.state.margin_2);

    axios.post(url + "/obat/save", form)
    .then(response => {
      alert(response.data.message);
      this.get_obat(); // refresh data
    })
    .catch(error => {
      console.log(error);
    })
  }

  Drop = (id) => {
    axios.delete(url + "/obat/drop/" + id)
    .then(response => {
      alert(response.data.message);
      this.get_obat(); // refresh data
    })
    .catch(error => {
      console.log(error);
    });
  }

  search = (event) => {
    let form = new FormData();
    form.append("find", this.state.find);
    axios.post(url + "/obat", form)
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
      this.get_obat();
      this.get_satuan();
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
        <TopHeader navigation={this.props.navigation} title="Data Obat" />
        <ScrollView style={{padding:10, height:"80%"}}>
        <Input type="text" name="find" value={this.state.find} onChangeText={(value) => this.setState({find:value})} placeholder="Searching"/>
        <Button title="Cari" onPress={() => this.search()} buttonStyle={{backgroundColor:"orange"}}/>
          {
            this.state.obat.map((item,index) => (
              // Map/Foreach = Menscanning Render
              <ListItem
                key={index}
                title={
                  <View>
                  <Text style={{color:"green", fontSize:20, fontWeight:"bold"}}>
                  {item.nama_obat}
                  </Text>

                  <Text style={{color:"green", fontSize:20}}>
                  Stok: {item.stok}
                  </Text>

                  <Text style={{color:"green", fontSize:20}}>
                  Harga: {(Number(item.harga) * (Number(item.margin_1) + (Number(item.margin_2))) + (Number(item.harga)))}
                  </Text>
                  </View>
                }
                subtitle={
                  <View>

                    <View style={{flexDirection: "row"}}>

                    <Button containerStyle={{margin:5}} title="Edit" onPress={() => this.EditObat(item)} />
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

          title="Tambah Obat" onPress={this.AddObat} type="solid" containerStyle={{marginBottom:20}} />
          <Overlay
            isVisible={this.state.form_visible}
            onBackdropPress={() => this.setState({from_visible: false})}>
          <ScrollView>
            <Input containerStyle={{margin:2}}
            label="Nama Obat" value={this.state.nama_obat} onChangeText={(value) => this.setState({nama_obat:value})} />

            <Input containerStyle={{margin:2}}
            label="Stok" value={this.state.stok} onChangeText={(value) => this.setState({stok:value})} />

          <Text h5>Pilih Kategori</Text>
          <Picker
            selectedValue={this.state.id_kategori}
            style={{width:"100%", height:80}}
            onValueChange={(value) => this.setState({id_kategori:value})}>
            {this.state.kategori.map((item,index) =>(

              <Picker.Item key={"kategori" + index} label={item.nama_kategori} value={item.id_kategori} />
            ))}
          </Picker>

          <Text h5>Pilih Satuan</Text>
          <Picker
            selectedValue={this.state.id_satuan}
            style={{width:"100%", height:80}}
            onValueChange={(value) => this.setState({id_satuan:value})}>
            {this.state.satuan.map((item,index) => (

              <Picker.Item key={"satuan" + index} label={item.nama_satuan} value={item.id_satuan} />
            ))}
          </Picker>

          <Input containerStyle={{margin:2}}
          label="Margin1" value={this.state.margin_1} onChangeText={(value) => this.setState({margin_1:value})} />
          <Input containerStyle={{margin:2}}
          label="Margin2" value={this.state.margin_2} onChangeText={(value) => this.setState({margin_2:value})} />
          <Input containerStyle={{margin:2}}
          label="Harga" value={this.state.harga} onChangeText={(value) => this.setState({harga:value})} />

            <Button title="Simpan" type="solid" onPress={this.Save} buttonStyle={{backgroundColor:"green"}} />
            </ScrollView>
          </Overlay>
        </View>
    )
  }
}

export default ObatScreen;
