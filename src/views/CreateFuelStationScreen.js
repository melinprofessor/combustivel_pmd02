import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Input, Icon, Button } from 'react-native-elements';
import { registerFuelStation, zipCode } from '../service/fuelstation.service';
import HeaderComponent from '../components/HeaderComponent';
import TextInputComponent from '../components/TextInputComponent';
import AlertComponent from '../components/AlertComponent';
import ButtonAvatarComponent from '../components/ButtonAvatarComponent';

let navigate = null;

export function navigationOptions({ navigate }) {
  return {
    title: 'Adicionar',
    header: null
  };
}

const checkZipCode = (cep, setAddress, setError) => {
  zipCode(cep)
    .then(response => {
      setAddress(response);
    })
    .catch(e => {
      setError('CEP é inválido!');
    });
};

const showZipCode = (address, error) => {
  const nda = 'NDA';
  if (address && address.cep) {
    return (
      <View style={estilo.cepInformation}>
        <Text style={estilo.textCep}>Rua: {address.logradouro || nda}</Text>
        <Text style={estilo.textCep}>Bairro: {address.bairro || nda}</Text>
        <Text style={estilo.textCep}>Cidade: {address.localidade || nda}</Text>
        <Text style={estilo.textCep}>
          Complemento: {address.complemento || nda}
        </Text>
        <Text style={estilo.textCep}>UF: {address.uf || nda}</Text>
      </View>
    );
  } else if (error.length === 8) {
    return Alert.alert(
      'Erro CEP',
      error,
      [{ text: 'OK', onPress: () => console.log('ok') }],
      { cancelable: false }
    );
  }
};

const register = async fuelStationEntity => {
  const fuelstation = await registerFuelStation(fuelStationEntity);
  let title,
    msg = '';
  let buttons = [
    {
      text: 'Cancel',
      onPress: () => navigate('RegisterFuelStation'),
      style: 'cancel'
    },
    {
      text: 'Ok',
      onPress: () => console.log('ok')
    },
  ];

  if (fuelstation && fuelstation.code === 11000) {
    title = 'Erro ao Cadastrar';
    msg = 'Já existe um posto cadastro com este nome';
  } else if (fuelstation.errors) {
    title = 'Erro ao Cadastrar';
    msg = Object.keys(fuelstation.errors)
      .map(t => fuelstation.errors[t].message)
      .join('\n');
  } else {
    title = 'Sucesso ao cadastrar!';
    msg = 'Deseja cadastrar outro posto?';
    buttons = [
      {
        text: 'Não',
        onPress: () => navigate('RegisterFuelStation'),
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: () => console.log('sim')
      }
    ];
  }

  return AlertComponent(title, msg, buttons);
};

const CreateFuelStation = props => {
  navigate = props.navigation.navigate;
  const [name, setName] = useState('');
  const [address, setAdddres] = useState({});
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  const [active, setActive] = useState(true);

  return (
    <View style={estilo.container}>
      <HeaderComponent
        {...props}
        title="Adicionar Posto de Gasolina"
        icone="local-gas-station"
      />
      <View style={estilo.form}>
        <TextInputComponent
          label="Nome do Posto"
          placeHolder="Nome do Posto"
          icone="local-gas-station"
          nameInput="nameFuelStation"
          value={name}
          setValue={setName}
        />
        <View style={estilo.cepBox}>
          <Input
            keyboardType="numeric"
            containerStyle={{ marginTop: 10, width: '70%' }}
            label="CEP"
            placeholder="Digite o cep"
            value={zipCode}
            leftIcon={
              <Icon
                name="location-searching"
                size={24}
                color="black"
                type="material"
              />
            }
            maxLength={8}
          />
          <View style={estilo.cepBoxButton}>
            <Button
              icon={
                <Icon name="procurar" size={24} color="white" type="material" />
              }
              onPress={() => checkZipCode(zipCode, setAdddres, setError)}
            />
          </View>
        </View>
        <View style={estilo.address}>{showZipCode(address, error)}</View>
      </View>
      <View style={estilo.buttonAction}>
        <ButtonAvatarComponent
          size="medium"
          iconColor="red"
          name="trash"
          subTitle="Cancelar"
          {...props}
          onPress={() => {
            props.navigation.goBack();
          }}
        />
        <ButtonAvatarComponent
          size="medium"
          iconColor="green"
          name="check-circle"
          subTitle="Cadastrar"
          {...props}
          onPress={async () => {
            await register({ name: name, active: active, address: address });
          }}
        />
      </View>
    </View>
  );
};
