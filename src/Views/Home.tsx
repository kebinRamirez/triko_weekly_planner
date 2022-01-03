import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Overlay } from 'react-native-elements';
import { StyleSheet, View, Text, TextInput, ActivityIndicator, Dimensions, FlatList, Image, TouchableOpacity } from "react-native";
import SelectDropdown from 'react-native-select-dropdown';
import hourss from "../constants/hourss";
import weekDays from "../constants/weekDays";
import options from "../constants/options";

interface props {
  navigation: any;
}

const Home: React.FC<props> = ({ navigation }) => {

  const [selectedDay, setSelectedDay] = useState(1);
  const [hours, setHours] = useState(null);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [text, setText] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reload, setReload] = useState(false);
  const [noHour, setNoHour] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (hours == null) {
      getDay(selectedDay + "");
    }
  })

  useEffect(() => {
    getDay(selectedDay + "");
  }, [selectedDay]);

  useEffect(() => {
    getDay(selectedDay + "");
  }, [reload]);

  const saveDay = async (day, dayHours) => {
    try {
      await AsyncStorage.setItem(day, JSON.stringify(dayHours));
    } catch (error) {
      console.log(error);
    }
  }

  const getDay = async (day) => {
    try {
      const response = await AsyncStorage.getItem(day);
      if (response != null) {
        setHours(JSON.parse(response));
      } else {
        await AsyncStorage.setItem(day, JSON.stringify(hourss));
        setHours(hourss);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const saveEvent = () => {
    const temp = [];
    hours.map((item) => {
      if (item.id == selectedId) {
        temp.push({
          id: item.id,
          title: text,
          hour: item.hour,
        })
      } else {
        temp.push(item);
      }
    });
    setHours(null);
    saveDay(selectedDay + "", temp);
    setReload(!reload);
    setOpenOverlay(false);
    setSelectedId(null);
    setSelectedItem(null);
    setNoHour(false);
    setText("");
  }

  const deleteEvent = () => {
    const temp = [];
    hours.map((item) => {
      if (item.id == selectedId) {
        temp.push({
          id: item.id,
          title: "",
          hour: item.hour,
        })
      } else {
        temp.push(item);
      }
    });
    setHours(null);
    saveDay(selectedDay + "", temp);
    setReload(!reload);
    setOpenOverlay(false);
    setSelectedId(null);
    setSelectedItem(null);
    setNoHour(false);
    setText("");
  }

  return (
    <View style={styles.container}>
      {openOverlay && (
        <Overlay
          isVisible={openOverlay}
          overlayStyle={styles.overAdd}
          onBackdropPress={() => {
            setOpenOverlay(false);
            setNoHour(false);
            setSelectedItem(null);
            setText("");
          }}>
          <View style={{ width: '100%' }}>
            <View style={styles.overHeader}>
              <Text style={[styles.textOver, { fontWeight: 'bold' }]}>
                {"Add event"}
              </Text>
            </View>
            <View style={styles.overBody}>
              {noHour && (
                <SelectDropdown
                  data={options}
                  buttonStyle={styles.textInput}
                  onSelect={(selectedItem, index) => {
                    setSelectedId(index + 1);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem
                  }}
                  rowTextForSelection={(item, index) => {
                    return item
                  }}
                />
              )}
              <Text style={styles.textOver}>
                {'add title'}
              </Text>
              <TextInput
                onChangeText={setText}
                value={text}
                style={styles.textInput}
              />
              {noHour ? (
                <TouchableOpacity
                  onPress={() => {
                    saveEvent()
                  }}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    {'add'}
                  </Text>
                </TouchableOpacity>
              ) : (
                  selectedItem.title != "" ? (
                    <View style={{ width: '50%', justifyContent: 'space-between', flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={() => {
                          saveEvent()
                        }} style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>
                          {'add'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        deleteEvent()
                      }}
                        style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>
                          {'remove'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                      <TouchableOpacity
                        onPress={() => {
                          saveEvent()
                        }} style={styles.buttonStyle}>
                        <Text style={styles.buttonText}>
                          {'add'}
                        </Text>
                      </TouchableOpacity>
                    )
                )
              }
            </View>
          </View>
        </Overlay>
      )}
      <View style={styles.body}>
        <View style={styles.Header}>
          <View style={styles.titleSection}>
            <Text
              numberOfLines={1}
              style={styles.title}>
              {'My weekly planner'}
            </Text>
          </View>
          <View style={styles.plusSection}>
            <TouchableOpacity onPress={() => {
              setOpenOverlay(true);
              setNoHour(true);
            }} style={styles.plus}>
              <Image source={require("../imgs/plus.png")} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.weekSections}>
          <FlatList
            data={weekDays}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => {
                setSelectedDay(item.id);
              }} style={[{ backgroundColor: selectedDay == item.id ? ('#107da4') : ("#aed6e7") }, styles.weekOptions]}>
                <Text style={styles.weekTitle}>{item.name} </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <View style={styles.screen}>
        <View style={styles.labelsContainer}>
          <View style={[styles.view, { alignItems: 'flex-start' }]}>
            <Text style={styles.labels}>
              {"time"}
            </Text>
          </View>
          <View style={[styles.view, { alignItems: 'center' }]}>
            <Text style={styles.labels}>
              {"event name"}
            </Text>
          </View>
          <View style={[styles.view, { alignItems: 'flex-end' }]}>
            <Text style={styles.labels}>
              {"occupied"}
            </Text>
          </View>
        </View>
        <View style={styles.borderBody}>
          {hourss == null ? (
            <View style={styles.fullScreenLoading}>
              <ActivityIndicator color={"#5BB4C4"} size={"large"} />
            </View>
          ) : (
              <FlatList
                data={hours}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => `${item.id}`}
                renderItem={({ item, index }) => (
                  <TouchableOpacity onPress={() => {
                    setOpenOverlay(true);
                    setSelectedItem(item);
                    setSelectedId(item.id);
                    setText(item.title);
                  }} style={[{ backgroundColor: item.title == "" ? ("white") : ("#e7ffef"), }, styles.Toucable]}>
                    <View style={[styles.view, { alignItems: 'flex-start' }]}>
                      <Text style={styles.hour}>
                        {item.hour}
                      </Text>
                    </View>
                    <View style={[styles.view, { alignItems: 'center' }]}>
                      {item.title == "" ? (
                        <Text style={styles.eventTitle}>
                          {"available"}
                        </Text>
                      ) : (
                          <Text numberOfLines={2} style={[styles.eventTitle, { color: 'black' }]}>
                            {item.title}
                          </Text>
                        )}
                    </View>
                    <View style={[styles.view, { alignItems: 'flex-end' }]}>
                      <View style={styles.imgContainer}>
                        {item.title != "" && (
                          <Image source={require("../imgs/check.png")} style={styles.img} />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'black'
  },
  overAdd: {
    width: '100%',
    borderWidth: 1,
    borderColor: "#50555d"
  },
  overHeader: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: "#50555d",
    backgroundColor: '#cbe1ec',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overBody: {
    marginVertical: 10,
    width: '100%',
    alignItems: 'center'
  },
  textOver: {
    color: "#50555d",
    fontSize: 18,
  },
  textInput: {
    borderColor: "#50555d",
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 5,
    width: '90%',
    height: 40,
    marginVertical: 10
  },
  buttonStyle: {
    height: 40,
    borderWidth: 1,
    borderColor: "#50555d",
    borderRadius: 5,
    backgroundColor: '#cbe1ec',
    justifyContent: 'center'
  },
  buttonText: {
    marginHorizontal: 20,
    color: "#50555d",
    fontSize: 18
  },
  body: {
    width: '100%',
    height: 150,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'black'
  },
  Header: {
    flexDirection: 'row',
    width: '100%'
  },
  titleSection: {
    flex: 8,
    height: 80,
    justifyContent: 'center',
    paddingLeft: 15
  },
  title: {
    color: 'black',
    fontSize: 28,
    fontWeight: 'bold'
  },
  plusSection: {
    flex: 2,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plus: {
    height: 45,
    width: 45,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#107da4'
  },
  weekSections: {
    width: '100%',
    height: 70,
    paddingLeft: 10
  },
  weekOptions: {
    height: 40,
    width: 110,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  weekTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  screen: {
    width: '100%',
    height: Dimensions.get('window').height - 156,
    backgroundColor: 'white'
  },
  labelsContainer: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  view: {
    flex: 1,
    justifyContent: 'center',
  },
  labels: {
    color: 'black',
    fontSize: 16
  },
  eventTitle: {
    color: '#ccceca',
    fontSize: 15,
    fontWeight: "bold"
  },
  borderBody: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccceca',
    marginHorizontal: 10
  },
  fullScreenLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Toucable: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccceca',
    height: 40
  },
  hour: {
    color: '#595A5A',
    fontWeight: 'bold',
    fontSize: 14,
    paddingLeft: 10
  },
  imgContainer: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#595A5A',
    borderRadius: 15,
    marginRight: 10
  },
  img: {
    height: 20,
    width: 20,
    tintColor: '#00fc13'
  }
});