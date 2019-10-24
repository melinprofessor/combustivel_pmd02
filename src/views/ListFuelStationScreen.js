import React,{useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {Text, Icon, Button, Overlay} from 'react-native-elements';
import HeaderComponent from '../components/HeaderComponent';
import {getAllFuelStation, deleteFuelStation} from '../service/fuelstation.service';
import AlertComponent from '../components/AlertComponent';
import moment from 'moment';

export function navigationOptions({navigation}) {
    return {
        title: 'Listar Postos de Gasolina',
        header: null
    }
}

const ListItens = props => {
    const { navigate } = props.navigation;
    const [show, setShow] = useState(false);
    const SCREEN_HEIGHT = Dimensions.get('window').height;
    return (
        <View style={[estilo.box, { backgroundColor: props.item.active ? 'rgba(12,188,223,1)': '#D3D3D3'}]}>
            <Overlay
            isVisible={show}
            onBackdropPress={()=> setShow(false)}
            fullScreen={false}
            height={SCREEN_HEIGHT - 350}
            >
                <View style={{ flex: 1}}>
                    <View style={{flex: 2}}>
                        <Text style={{ fontSize: 20, lineHeight:35}}>CEP: {props.item.address.cep || 'NDA'}</Text>
                        <Text style={{ fontSize: 20, lineHeight:35}}>Rua: {props.item.address.logradouro || 'NDA'}</Text>
                        <Text style={{ fontSize: 20, lineHeight:35}}>Bairro: {props.item.address.bairro || 'NDA'}</Text>
                        <Text style={{ fontSize: 20, lineHeight:35}}>Cidade: {props.item.address.localidade || 'NDA'}</Text>
                        <Text style={{ fontSize: 20, lineHeight:35}}>UF: {props.item.address.uf || 'NDA'}</Text>
                    </View>
                    <Button  style={{marginTop: 15}} title='Fechar' onPress={()=> setShow(false)}/>
                </View>
            </Overlay>
            <View style={{ flex: 11, justifyContent: 'space-between'}}>
                <Text style={estilo.texto}>Nome: {props.item.name}</Text>
                <Text style={estilo.texto}>Ativo: {props.item.active ? 'SIM' : 'NÃO'}</Text>
                <Text style={estilo.texto}>Cadastro: {moment(props.item.createdAt).format('DD/MM/YYYY')}</Text>
            </View>
        </View>
    )
}
const getListFuelStation = setList => {
    getAllFuelStation().then(data => {
        setList(data);
    });
}

const ListFuelStation = (props) => {
    const [list, setList] = useState([]);

    useEffect(()=>{
        getListFuelStation(setList);
    })

    return (
        <View style={{ flex: 1}}>
           <HeaderComponent {...props} title="Listar Postos de Gasolina" icone='list' />
           <ScrollView style={estilo.container}>
               <View>
                   {list.map((item) => (
                       <ListItens key={item.name} item={item} {...props} />
                   ))}
               </View>
           </ScrollView>
        </View>
    )
}

const Screen = {
    screen: ListFuelStation,
    navigationOptions,
    params:{
        navigationTypes: 'stack'
    }
}

const estilo = StyleSheet.create({
    container: {
        flex: 1
    },
    box: {
        margin: 10,
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row'
    },
    texto: {
        fontSize: 20,
        color: 'white'
    }
})
export default Screen;