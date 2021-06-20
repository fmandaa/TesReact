import React from 'react';
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import KategoriScreen from "./screen/KategoriScreen";
import ObatScreen from "./screen/ObatScreen";
import SatuanScreen from "./screen/SatuanScreen";

// konfigurasi navigasi yang akan dibuat dan load tampilan
// pada setiap navigasinya

const AppNavigator = createDrawerNavigator({
  Kategori : {
    screen: KategoriScreen
  },
  Satuan : {
    screen: SatuanScreen
  },
  Obat : {
    screen: ObatScreen
  }

});

export default createAppContainer(AppNavigator);
