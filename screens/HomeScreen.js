import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { theme } from '../theme'
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline'
import {CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid'
import { fetchLocations, fetchWeatherForecast } from '../Api/weather'
import {debounce} from 'lodash';
import { weatherImages } from '../constants'

export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([])
    const [weather, setWeather] =useState({})
    const handleLocation = (loc) =>{
        console.log('location ', loc)
        setLocations([]);
        fetchWeatherForecast({
            cityName: loc.name,
            day:'7'
        }).then(data=>{
            setWeather(data);
            console.log('got forecast: ',data );
        })
    }
    const handleSearch = value =>{
        console.log('value ', value)

    
    if(value.length>2){
        fetchLocations({cityName: value}).then(data=>{
            setLocations(data);
        })
    }
}
useEffect(()=>{
    fetchMyWeatherData();
},[]);
const fetchMyWeatherData = async ()=>{
    fetchWeatherForecast({
        cityName:'Quang Ngai',
        days:'7'
    }).then(data=>{
        setWeather(data);
    })
}
    const handleTextDeBounce = useCallback(debounce(handleSearch, 1200), [])
    const {current, location} = weather;
  return (
    <View style={{ flex: 1, backgroundColor: '#3b82f6' , position: 'relative' }}>
    <StatusBar style="light" />
   <SafeAreaView className ="flex flex-1">
    {/*searching*/}
    <View style={{ marginTop: '15%', height: '5%'}} className="mx-4 relative z-50"> 
        <View className="flex-row justify-end items-center rounded-full"
            style={{backgroundColor:showSearch? theme.bgWhite(0.2):'transparent'}}>{
                showSearch?(
                    <TextInput 
                    onChangeText={handleTextDeBounce}
                    placeholder='Search city'
                    placeholderTextColor={'lightgray'}
                    className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                    />
                ):null
            }
           
            <TouchableOpacity
            onPress={()=> toggleSearch(!showSearch)}
            style={{bbackgroundColor: theme.bgWhite(0.3)}}
            className="rounded-full p-3 m-1">
                <MagnifyingGlassIcon size ="25" color="white"/>
            </TouchableOpacity>
        </View>
        {
            locations.length>0 && showSearch?(
                <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                {
                   locations.map ((loc,index)=>
                    {
                     let showBorder = index + 1 != locations.length;
                     let borderClass = showBorder?'border-b-4 border-b-gray-400':'';
                     return (
                         <TouchableOpacity
                         onPress={()=> handleLocation(loc)}
                         key={index}
                         className={"flex-row items-center border-0 p-3 px-4 mb-1"+ borderClass}
                         >
                            <MapPinIcon size="20" color="gray" />   
                            <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                         </TouchableOpacity>
                     )
                    })     
                }
                   
                </View>

            ):null
        }
    </View>
    <View className="mx-4 flex justify-around flex-1  mb-2">
        <Text className="text-white text-center text-2xl font-bold">
            {location?.name},
            <Text className="text-lg font-semibold text-gray-300">
                {" "+location?.country}
            </Text>
        </Text>
        <View className="flex-row justify-center">
            <Image
                
                source={weatherImages[current?.condition?.text]}
                className="w-52 h-52"
            />
        </View>
        <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-3">
               {current?.temp_c}&#176;
            </Text>
            <Text className="text-center text-white text-xl tracking-widest">
            {current?.condition?.text}
        </Text>
        </View>
        <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
                <Image source ={require('../assets/Icons/cloud.png')}className="h-6 w-6"/>
                <Text className="text-white font-semibold text-base">
                    {current?.cloud}
                </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
                <Image source ={require('../assets/Icons/drop.png')}className="h-6 w-6"/>
                <Text className="text-white font-semibold text-base">
                    {current?.humidity}%
                </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
                <Image source ={require('../assets/Icons/sun.png')}className="h-6 w-6"/>
                <Text className="text-white font-semibold text-base">
                {current?.uv}
                </Text>
            </View>
        </View>
    </View>
    {/* next 7 days */}
    <View className="mb-2 space-y-3">
        <View className="flex-row items-center mx-5 space-x-2">
            <CalendarDaysIcon size ="22" color="white"/>
            <Text className="text-white text-base"> Daily forecast</Text>
        </View>
        <ScrollView
        horizontal
        contentContainerStyle={{paddingHorizontal: 15}}
        showsHorizontalScrollIndicator={false}
        >
            {
                weather?.forecast?.forecastday?.map((item,index)=>{
                    let date = new Date(item.date);
                    let options ={weekday:'long'};
                    let dayName = date.toLocaleDateString('en-us',options)
                    return (
                        <View
                            key={index}
                            className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                            style={{backgroundColor:theme.bgWhite(0.15)}}
                            >
                            <Image source={weatherImages[item?.day?.condition?.text]}
                            className="h-11 w-11"/>
                            <Text className="text-white">{dayName}</Text>
                            <Text className="text-white text-xl font-semibold">
                                {item?.day?.avgtemp_c}&#176;   
                            </Text>
                        </View> 
                    )
                })
            }
       </ScrollView>
    </View>
   </SafeAreaView>
  </View>    
  )
}