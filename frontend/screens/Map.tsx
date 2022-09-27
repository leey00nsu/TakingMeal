import Geolocation from "@react-native-community/geolocation";
import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
  FunctionComponent,
  useCallback,
} from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import Ionicon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Location,
  Locations,
  setLocations,
} from "../redux/reducers/locationsReducer";
import axios from "axios";
import { WithLocalSvg } from "react-native-svg";

const LocationModal: FunctionComponent<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  location: Location;
  filter: string;
}> = ({ open, setOpen, location, filter }) => {
  const userId = useSelector((store: Store) => {
    return store.user.userId;
  }, shallowEqual);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  const translateY = new Animated.Value(0);
  const modalUp = Animated.timing(translateY, {
    toValue: -180,
    duration: 500,
    useNativeDriver: true,
  });

  const submitHandler = useCallback(() => {
    Keyboard.dismiss();
    axios
      .post(`http://172.30.1.43:8080/${location?.id}/comments/${userId}`, {
        content: comment,
      })
      .then((response) => {
        setComments(response.data);
        setComment("");
      })
      .catch((error) => {
        throw error;
      });
  }, [comment]);

  useEffect(() => {
    axios
      .get(`http://172.30.1.43:8080/${location?.id}/comments`)
      .then((response) => {
        setComments(response.data);
      });
  }, [open]);

  return (
    <Modal
      isVisible={open}
      onBackdropPress={() => {
        setOpen(false);
        setComment("");
      }}
      onBackButtonPress={() => {
        setOpen(false);
        setComment("");
      }}
      backdropOpacity={0.4}
      animationInTiming={500}
      animationOutTiming={500}
      style={{ margin: 0, flex: 1, justifyContent: "flex-end" }}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <Animated.View
        style={[styles.modal, { transform: [{ translateY: translateY }] }]}
      >
        <View
          style={{
            height: 8,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 10,
          }}
        >
          <View
            style={{
              height: 6,
              width: "50%",
              backgroundColor: "lightgrey",
              borderRadius: 30,
            }}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              position: "relative",
              width: "100%",
              alignItems: "center",
              borderBottomColor: "#F2F2F2",
              paddingVertical: 20,
              borderBottomWidth: 1,
            }}
            onTouchEnd={() => {
              modalUp.start();
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#5AC9BC",
                fontFamily: "LeferiBaseRegular",
              }}
            >
              {filter === "goodInfluence" ? "선한 영향력" : "카드 가맹점"}
            </Text>
            <Text
              style={{
                fontSize: 24,
                marginTop: 10,
                fontFamily: "LeferiBaseRegular",
                flexShrink: 1,
                flexWrap: "wrap",
                width: "90%",
                textAlign: "center",
              }}
              multiline={true}
            >
              {location.name}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingLeft: 10,
            paddingRight: 16,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#F2F2F2",
            width: "100%",
            borderBottomWidth: 6,
            justifyContent: "space-between",
          }}
        >
          <MaterialIcon name="location-on" size={28} color="#D4D4D4" />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "LeferiBaseRegular",
              width: "100%",
            }}
          >
            {location.address}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 80 }}>
          <View
            style={{
              width: "100%",
              borderBottomColor: "#F2F2F2",
              borderBottomWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
            }}
          >
            <FontAwesomeIcon name="comments" color="#A4A4A4" size={20} />
            <Text
              style={{
                fontSize: 16,
                fontFamily: "LeferiBaseRegular",
                marginLeft: 5,
              }}
            >
              댓글 {comments.length}
            </Text>
          </View>
          <ScrollView
            style={{ width: "100%", position: "relative", paddingBottom: 200 }}
          >
            {comments.map((comment) => {
              return (
                <View
                  key={comment.id}
                  style={{
                    width: "100%",
                    borderBottomColor: "#F2F2F2",
                    borderBottomWidth: 1,
                    flexDirection: "row",
                    paddingVertical: 20,
                    position: "relative",
                  }}
                >
                  <View
                    style={{ position: "absolute", width: "100%", top: 20 }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <WithLocalSvg
                        width={35}
                        height={35}
                        fill="#d03434"
                        asset={require("../img/user.svg")}
                      />
                      <Text
                        style={{
                          fontFamily: "LeferiBaseRegular",
                          color: "#000000",
                          marginLeft: 10,
                        }}
                      >
                        {comment.writer.substr(0, 3)}****
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: "LeferiBaseRegular",
                        position: "absolute",
                        right: 0,
                        height: 35,
                        lineHeight: 35,
                      }}
                    >
                      {`${
                        new Date(comment.commentTime).getMonth() + 1 > 10
                          ? new Date(comment.commentTime).getMonth() + 1
                          : "0" + (new Date(comment.commentTime).getMonth() + 1)
                      }/${
                        new Date(comment.commentTime).getDate() > 10
                          ? new Date(comment.commentTime).getDate()
                          : 0 + new Date(comment.commentTime).getDate()
                      }`}
                    </Text>
                  </View>
                  <Text
                    style={{ fontFamily: "LeferiBaseRegular", paddingTop: 43 }}
                  >
                    {comment.commentMessage}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Animated.View>
      <View
        style={{
          backgroundColor: "#F2F2F2",
          width: "100%",
          height: 80,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderColor: "#D9D9D9",
            borderWidth: 1,
            height: 50,
            width: "90%",
            borderRadius: 12,
            flexDirection: "row",
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 1,
          }}
        >
          <TextInput
            placeholder="댓글을 입력하세요."
            value={comment}
            onChangeText={(text) => {
              setComment(text);
            }}
            onSubmitEditing={submitHandler}
            style={{
              fontFamily: "LeferiBaseRegular",
              width: "80%",
              fontSize: 15,
              marginHorizontal: 10,
            }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 0,
              width: 50,
              height: "100%",
              backgroundColor: "#5AC9BC",
              borderRadius: 11,
              justifyContent: "center",
              alignItems: "center",
            }}
            activeOpacity={0.8}
            onPress={submitHandler}
          >
            <EntypoIcon name="direction" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Map: FunctionComponent<{ jumpTo: any }> = ({ jumpTo }) => {
  const locations = useSelector((store: Store) => {
    return store.locations;
  }, shallowEqual);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  }>();
  const [modal, setModal] = useState(false);
  const [filter, setFilter] = useState("schoolLunch");
  const [location, setLocation] = useState<Location>();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const map = useRef<any>(null);
  const list = useRef<any>(null);

  const opacity = new Animated.Value(0);
  const Intro = Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  });

  const RefrigeratorCard: FunctionComponent<{
    item: Location;
    index: number;
  }> = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          location === item ? {} : { backgroundColor: "#E8E8E8" },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          map.current.animateToRegion({
            latitude: item.lat,
            longitude: item.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          list.current.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.5,
          });
          setLocation(item);
        }}
      >
        <Image
          source={require("../img/sharedRefrigerator.png")}
          style={{ width: 70, height: 70 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#FFC063",
              marginBottom: -5,
              fontFamily: "LeferiBaseRegular",
            }}
          >
            공유 냉장고
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "LeferiBaseRegular",
              marginTop: 5,
            }}
          >
            {item.id}호점
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <MaterialIcon name="location-on" size={16} color="#D4D4D4" />
            <Text style={{ fontSize: 12, fontFamily: "LeferiBaseRegular" }}>
              {item.address?.length > 20
                ? item.address?.substring(0, 20 - 3) + "..."
                : item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const StoreCard: FunctionComponent<{
    item: Location;
    index: number;
  }> = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          location === item ? {} : { backgroundColor: "#E8E8E8" },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          map.current.animateToRegion({
            latitude: item.lat,
            longitude: item.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
          list.current.scrollToIndex({
            animated: true,
            index: index,
            viewPosition: 0.5,
          });
          setLocation(item);
          location === item && setModal(true);
        }}
      >
        <Image
          source={
            filter === "goodInfluence"
              ? require("../img/goodInfluence.png")
              : require("../img/schoolLunch.png")
          }
          style={{ width: 70, height: 70 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#FFC063",
              marginBottom: -5,
              fontFamily: "LeferiBaseRegular",
            }}
          >
            {filter === "goodInfluence" ? "선한 영향력" : "카드 가맹점"}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "LeferiBaseRegular",
              color: "#000000",
              marginTop: 7,
              overflow: "hidden",
            }}
          >
            {item.name?.length > 15
              ? item.name?.substring(0, 15 - 3) + "..."
              : item.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <MaterialIcon name="location-on" size={16} color="#D4D4D4" />
            <Text
              style={{
                fontSize: 12,
                fontFamily: "LeferiBaseRegular",
                overflow: "hidden",
              }}
            >
              {item.address?.length > 20
                ? item.address?.substring(0, 20 - 3) + "..."
                : item.address}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    axios
      .get("http://172.30.1.43:8080/loadapi")
      .then((response) => {
        dispatch(
          setLocations({
            goodInfluence: response.data.goodInfluenceShop,
            schoolLunch: response.data.cafeteriaCardStore,
          })
        );
        setLoading(false);
        filterHandler();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    if (!loading) {
      filterHandler();
    }
  }, [filter]);

  const filterHandler = () => {
    Keyboard.dismiss();
    setSearch("");
    setResult([]);
    location && setLocation(locations[filter][0]);
    locations[filter] &&
      map.current.animateToRegion({
        latitude: locations[filter][0].lat,
        longitude: locations[filter][0].lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    list.current.scrollToIndex({
      animated: true,
      index: 0,
      viewPosition: 0.5,
    });
  };

  return (
    <>
      {/* Map */}
      <MapView
        ref={map}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.64320085782944,
          longitude: 127.10559017906716,
          // latitude: currentLocation?.lat,
          // longitude: currentLocation?.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onMapLoaded={() => {
          Intro.start();
        }}
        toolbarEnabled={false}
        zoomControlEnabled={false}
        loadingBackgroundColor="lightgray"
        loadingEnabled
      >
        {search.length > 0
          ? result.map((location) => {
              return (
                <Marker
                  pinColor="linen"
                  key={location.id}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  onPress={(event) => {
                    event.preventDefault();
                    map.current.animateToRegion({
                      latitude: location.lat,
                      longitude: location.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    });
                    filter !== "sharedRefrigerator" &&
                      list.current.scrollToIndex({
                        animated: true,
                        index: result.findIndex((_location) => {
                          return location.id === _location.id;
                        }),
                        viewPosition: 0.5,
                      });
                  }}
                />
              );
            })
          : locations[filter].map((location) => {
              return (
                <Marker
                  pinColor="linen"
                  key={location.id}
                  coordinate={{
                    latitude: location.lat,
                    longitude: location.lng,
                  }}
                  onPress={(event) => {
                    event.preventDefault();
                    map.current.animateToRegion({
                      latitude: location.lat,
                      longitude: location.lng,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    });
                    list.current.scrollToIndex({
                      animated: true,
                      index: locations[filter].findIndex((_location) => {
                        return location.id === _location.id;
                      }),
                      viewPosition: 0.5,
                    });
                  }}
                />
              );
            })}
      </MapView>

      <View
        style={{ position: "absolute", width: "100%", paddingHorizontal: 16 }}
      >
        {/* Search */}
        <Animated.View style={[styles.searchContainer, { opacity: opacity }]}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "#FFC063",
              borderRadius: 12,
              padding: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <WithLocalSvg
              width={35}
              height={35}
              fill="#FFC063"
              asset={require("../img/logo_w.svg")}
            />
          </View>

          <TextInput
            style={[styles.input]}
            placeholder={
              filter === "sharedRefrigerator"
                ? "공유 냉장고는 검색하실 수 없습니다."
                : filter === "goodInfluence"
                ? `선한 영향력 검색`
                : `카드 가맹점 검색`
            }
            placeholderTextColor={
              filter === "sharedRefrigerator" ? "red" : "grey"
            }
            value={search}
            editable={filter !== "sharedRefrigerator"}
            selectTextOnFocus={filter !== "sharedRefrigerator"}
            onChangeText={(text) => {
              result.length > 0 &&
                list.current.scrollToIndex({
                  animated: false,
                  index: 0,
                  viewPosition: 0.5,
                });
              setSearch(text);
              setResult(
                locations[filter].filter((location) => {
                  return location.name?.includes(text);
                })
              );
            }}
          />
          <TouchableOpacity
            style={[styles.iconContainer, { width: 50, height: 50 }]}
            activeOpacity={0.6}
            onPress={() => {
              Keyboard.dismiss();
              search.length > 0 ? setSearch("") : jumpTo("second");
            }}
          >
            {search.length > 0 ? (
              <MaterialIcon name="cancel" color="lightgray" size={35} />
            ) : (
              <FontAwesomeIcon name="user-circle" color="lightgray" size={30} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Filter */}
        <Animated.View style={[styles.filterContainer, { opacity: opacity }]}>
          <TouchableOpacity
            onPress={() => {
              if (filter !== "schoolLunch") {
                setSearch("");
                setFilter("schoolLunch");
              }
            }}
            style={[
              styles.filter,
              filter === "schoolLunch" && { backgroundColor: "#5AC9BC" },
            ]}
          >
            <View
              style={[
                styles.filterIconContainer,
                filter === "schoolLunch"
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#A4A4A4" },
              ]}
            >
              <Ionicon
                name="card"
                color={filter === "schoolLunch" ? "#5AC9BC" : "white"}
                size={15}
              />
            </View>
            <Text
              style={[
                filter === "schoolLunch" && { color: "white" },
                { fontFamily: "LeferiBaseRegular" },
              ]}
            >
              카드 가맹점
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (filter !== "goodInfluence") {
                setSearch("");
                setFilter("goodInfluence");
              }
            }}
            style={[
              styles.filter,
              filter === "goodInfluence" && { backgroundColor: "#5AC9BC" },
            ]}
          >
            <View
              style={[
                styles.filterIconContainer,
                filter === "goodInfluence"
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#A4A4A4" },
              ]}
            >
              <FontAwesome5Icon
                name="hand-holding-heart"
                color={filter === "goodInfluence" ? "#5AC9BC" : "white"}
                size={15}
              />
            </View>
            <Text
              style={[
                filter === "goodInfluence" && { color: "white" },
                { fontFamily: "LeferiBaseRegular" },
              ]}
            >
              선한 영향력
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (filter !== "sharedRefrigerator") {
                setSearch("");
                setFilter("sharedRefrigerator");
              }
            }}
            style={[
              styles.filter,
              filter === "sharedRefrigerator" && {
                backgroundColor: "#5AC9BC",
              },
            ]}
          >
            <View
              style={[
                styles.filterIconContainer,
                filter === "sharedRefrigerator"
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#A4A4A4" },
              ]}
            >
              <EntypoIcon
                name="classic-computer"
                color={filter === "sharedRefrigerator" ? "#5AC9BC" : "white"}
                size={15}
              />
            </View>
            <Text
              style={[
                filter === "sharedRefrigerator" && { color: "white" },
                { fontFamily: "LeferiBaseRegular" },
              ]}
            >
              공유 냉장고
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* List */}

      <>
        <Animated.FlatList
          initialNumToRender={80}
          ref={list}
          data={search.length > 0 ? result : locations[filter]}
          renderItem={
            filter !== "sharedRefrigerator" ? StoreCard : RefrigeratorCard
          }
          decelerationRate={0}
          snapToAlignment="center"
          horizontal
          pagingEnabled
          disableIntervalMomentum
          showsHorizontalScrollIndicator={false}
          style={[styles.list, { opacity: opacity }]}
        />

        {location && (
          <LocationModal
            open={modal}
            setOpen={setModal}
            location={location}
            filter={filter}
          />
        )}
      </>
    </>
  );
};

const shadow = {
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
};

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "80%",
    position: "absolute",
    bottom: -100,
    backgroundColor: "white",
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },

  searchContainer: {
    display: "flex",
    width: "100%",
    height: 50,
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    // justifyContent: 'space-between',
    position: "absolute",
    top: 25,
    left: 16,
    backgroundColor: "white",
    borderRadius: 15,
    ...shadow,
  },
  input: {
    width: 250,
    fontSize: 15,
    marginHorizontal: 5,
    fontFamily: "LeferiBaseRegular",
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  filterContainer: {
    position: "absolute",
    top: 94,
    left: 16,
    flexDirection: "row",
  },
  filterIconContainer: {
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  filter: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginRight: 6,
    paddingVertical: 3,
    paddingLeft: 3,
    paddingRight: 10,
    ...shadow,
  },

  list: {
    width: "100%",
    height: 120,
    position: "absolute",
    bottom: 35,
  },
  card: {
    width: 320,
    height: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    padding: 15,
    borderRadius: 20,
    backgroundColor: "white",
    ...shadow,
  },
  count: {
    width: 75,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 165,
    left: 18,
    borderRadius: 20,
    backgroundColor: "#ABABAB",
    ...shadow,
  },
});

export default Map;
