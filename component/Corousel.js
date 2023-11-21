import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import data from './data';

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const dotsFadeAnim = useRef(new Animated.Value(1)).current;
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
    onPanResponderMove: (e, gestureState) => {
      pan.x.setValue(gestureState.dx);
      console.log(gestureState.dx, 'utkarsh');
      if (gestureState.dx > 5 && gestureState.dx < 100) {
        fadeOut(dotsFadeAnim, 0.4);
      }
      if (gestureState.dx > 100 && gestureState.dx < 200) {
        fadeOut(dotsFadeAnim, 0.2);
      }
      if (gestureState.dx > 200 && gestureState.dx < 300) {
        fadeOut(dotsFadeAnim, 0);
      }
      if (gestureState.dx < -5 && gestureState.dx > -100) {
        fadeOut(dotsFadeAnim, 0.4);
      }
      if (gestureState.dx < -100 && gestureState.dx > -200) {
        fadeOut(dotsFadeAnim, 0.2);
      }
      if (gestureState.dx < -200 && gestureState.dx > -300) {
        fadeOut(dotsFadeAnim, 0);
      }
    },
    onPanResponderRelease: (e, gestureState) => {
      console.log(gestureState, 'gestureState');
      if (gestureState.dx > 50 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        fadeIn(dotsFadeAnim);
      } else if (gestureState.dx < -50 && currentIndex < data.length - 1) {
        setCurrentIndex(currentIndex + 1);
        fadeIn(dotsFadeAnim);
      } else if (currentIndex <= 0 || currentIndex >= data.length - 1) {
        fadeIn(dotsFadeAnim);
      }

      Animated.spring(pan, {
        toValue: {x: 0, y: 0},
        useNativeDriver: false,
      }).start();
      if (gestureState.dx !== 0) {
        setShowTitle(false);
        setTimeout(() => {
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }, 100);
        setTimeout(() => {
          setShowTitle(true);
        }, 400);
      }
    },
  });

  const fadeIn = anim => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = (anim, value) => {
    Animated.timing(anim, {
      toValue: value,
      duration: 50,
      useNativeDriver: false,
    }).start();
  };

  const handleSnapToItem = () => {
    // fadeOut(dotsFadeAnim);
    // setTimeout(() => {
    //   fadeIn(dotsFadeAnim);
    // }, 500);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   setCurrentIndex(prevIndex => (prevIndex + 1) % data.length);
    // }, 5000);
    // return () => clearInterval(intervalId);
  }, []);

  const renderDots = () => {
    return data.map((item, index) => (
      <Animated.View
        key={item.id}
        style={[
          styles.dot,
          {
            backgroundColor: index === currentIndex ? 'red' : 'black',
            opacity: dotsFadeAnim,
          },
        ]}
      />
    ));
  };

  return (
    <SafeAreaView>
      <View
        style={styles.container}
        {...panResponder.panHandlers}
        // onTouchStart={() => {
        //   handleSnapToItem();
        // }}
      >
        <Animated.Image
          source={{uri: data[currentIndex].imgUrl}}
          style={[styles.backgroundImage, {opacity: fadeAnim}]}
        />
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: dotsFadeAnim,
            },
          ]}>
          {showTitle && (
            <Animated.Text
              style={[
                styles.description,
                {
                  opacity: pan.x <= 50 ? 0 : 1,
                  transform: [{translateX: pan.x}],
                },
              ]}>
              {data[currentIndex].body}{' '}
            </Animated.Text>
          )}
          {showTitle && (
            <Animated.Text
              style={[
                styles.title,
                {
                  transform: [{translateX: pan.x}],
                },
              ]}>
              {data[currentIndex].title}
            </Animated.Text>
          )}

          {/* <Text style={styles.description}></Text> */}
        </Animated.View>
      </View>
      <View style={styles.dotsContainer}>{renderDots()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
    height: 500,
    marginLeft: 25,
    marginRight: 25,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',

    flexDirection: 'column-reverse',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    marginBottom: 5,
    transform: [{translateY: 5}],
  },
  description: {
    fontSize: 16,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    transform: [{translateY: 5}],
  },

  dotsContainer: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});

export default Carousel;
