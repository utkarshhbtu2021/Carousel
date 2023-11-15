import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import data from './data';
const SLIDER_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.99);
const CarouselCards = () => {
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  const imageFadeAnim = useRef(new Animated.Value(1)).current;
  const dotsFadeAnim = useRef(new Animated.Value(1)).current;
  const descriptionFadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = anim => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = anim => {
    Animated.timing(anim, {
      toValue: 0.2,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  useEffect(() => {
    fadeIn(imageFadeAnim);
    fadeIn(dotsFadeAnim);
    fadeIn(descriptionFadeAnim);
  }, [index]);

  const CarouselCardItem = ({item, index}) => {
    console.log(item, index, 'index');

    return (
      <View style={styles.container} key={index}>
        <Animated.View
          style={{
            opacity: imageFadeAnim,
            backgroundColor: imageFadeAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.92)'],
            }),
          }}>
          <Image source={{uri: item.imgUrl}} style={styles.image} />
        </Animated.View>
        <Animated.View
          style={{
            opacity: dotsFadeAnim,
            backgroundColor: dotsFadeAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: ['rgba(255,99,71, 1)', 'rgba(255,99,71, 0)'],
            }),
          }}>
          <Text style={styles.header}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </Animated.View>
      </View>
    );
  };
  const handleSnapToItem = () => {
    fadeOut(imageFadeAnim);
    fadeOut(dotsFadeAnim);
    fadeOut(descriptionFadeAnim);
    setTimeout(() => {
      fadeIn(imageFadeAnim);
      fadeIn(dotsFadeAnim);
      fadeIn(descriptionFadeAnim);
    }, 500);
  };

  return (
    <View>
      <Carousel
        layout="tinder"
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={index => setIndex(index)}
        useScrollView={true}
        onTouchStart={() => {
          handleSnapToItem();
        }}
      />

      <Animated.View style={{opacity: dotsFadeAnim}}>
        <Pagination
          dotsLength={data.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
          }}
          inactiveDotStyle={{
            backgroundColor: 'red',
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
          tappableDots={true}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100',
    paddingBottom: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  image: {
    width: ITEM_WIDTH - 40,
    height: 300,
  },
  header: {
    color: '#222',
    fontSize: 28,
    fontWeight: 'bold',
    paddingLeft: 20,
    paddingTop: 20,
  },
  body: {
    color: '#222',
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default CarouselCards;
