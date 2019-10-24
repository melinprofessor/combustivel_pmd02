import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import RegisterFuelStation from '../views/RegisterFuelStationScreen';
import CreateFuelStationScreen from '../views/CreateFuelStationScreen';
import ListFuelStationScreen from '../views/ListFuelStationScreen';

const drawerNavigation = createDrawerNavigator({
    RegisterFuelStation: RegisterFuelStation,
    Adicionar: CreateFuelStationScreen,
});

const stackNavigation = createStackNavigator({
    drawer: {
        screen: drawerNavigation,
        navigationOptions: {
            header: null
        }
    },
    Adicionar: CreateFuelStationScreen,
    List: ListFuelStationScreen
});

export default createAppContainer(stackNavigation);