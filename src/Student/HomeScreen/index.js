import React, { Component } from "react";
import HomeScreen from "./HomeScreen.js";
import Settings from "../ProfileScreen/index.js";
import ProfileScreen from "../ProfileScreen";
import SideBar from "../SideBar/SideBar.js";
import { createDrawerNavigator } from "react-navigation";

const HomeScreenRouter = createDrawerNavigator(
  {
    Home: { screen: HomeScreen },
    Settings: { screen: Settings },
    ProfileScreen: { screen: ProfileScreen }
  },
  {
    contentComponent: props => <SideBar {...props} />
  }
);

export default HomeScreenRouter;


