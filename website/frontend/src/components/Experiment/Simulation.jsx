import React, { Component } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import {Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loader from 'react-loader-spinner'

import AudioButton from '../Experiment/AudioButton.jsx'

var trustword_top = require("../../images/trustwords_top.jpg");
var trustword_filler = require("../../images/trustwords_filler.jpg");

var URL_BASE = "https://afray.pythonanywhere.com"
// var URL_BASE = "http://localhost:5000" //DEBUG

const loadingAnimation = <Loader type="ThreeDots" color="#00BFFF" height="14"	width="20"/>

let styles = StyleSheet.create({
  top: {
    height: "30vh",
    resizeMode: 'stretch'
  },
  filler: {
    height: "25vh",
    resizeMode: "stretch"
  },
});

export default class TrustwordSimulation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      words: loadingAnimation,
      audio_url: [],
      controls_disabled: true,
      audio_button_visibility: "visible",
    }

    this.setup_experiment();

    this.toggleButtons = this.toggleButtons.bind(this)
  }

  experiment_finished(response_text) {
    if (response_text === "DONE") {

      this.props.history.push("/post_experiment")

      this.setState({
        controls_disabled: true,
        audio_button_visibility: "hidden"
      })

      return true
    }

    return false
  }

  onClick_accept() {
    this.show_word_loading()
    toast.success("ACCEPT")
    fetch(URL_BASE + '/submit_result?result=True')
      .then((r) => r.text())
      .then(() => this.refresh_words())
  }

  onClick_decline() {
    this.show_word_loading()
    toast.error("DECLINE" )
    fetch(URL_BASE + '/submit_result?result=False')
      .then((r) => r.text())
      .then(() => this.refresh_words())
  }

  setup_experiment() {
    this.show_word_loading()
    fetch(URL_BASE + '/new_experiment')
      .then((r) => r.text())
      .then(() => this.refresh_words())
  }

  refresh_words() {

    fetch(URL_BASE + '/get_words')
      .then(response => response.text())
      .then(t => {
        if (!this.experiment_finished(t)) {
          this.setState(
            { 
              words: t,
              controls_disabled: false
            }
          )
        }
      })
  }

  show_word_loading() {
    this.setState(
      { 
        words: loadingAnimation,
        controls_disabled: true
      }
    )
  }

  toggleButtons() {
    this.setState(
      {
        controls_disabled: !this.state.controls_disabled
      }
    )
  }

  render() {

    // Adds a dialog box checking if refresh is the desired action
    window.onbeforeunload = function () { return "X"; }

    return (
      <View style={{ backgroundColor: "white" }}>
        <Image
          source={trustword_top}
          style={styles.top}
        />
        <Text style={{ backgroundColor: "white", color: "black", margin: "10px"}}>
          {this.state.words}
        </Text>
        <button
          disabled={this.state.controls_disabled}
          style={{ 'margin': '10px', "backgroundColor": '#5cdd5c' }}
          onClick={() => this.onClick_accept()}>
          ACCEPT
          </button>
        <button
          disabled={this.state.controls_disabled}
          style={{ 'margin': '10px', "backgroundColor": '#ff5c5c' }}
          onClick={() => this.onClick_decline()}>
          DECLINE
          </button>
        <Image
          source={trustword_filler}
          style={styles.filler}
        />

        <AudioButton 
          text="Authenticate with partner over the phone"
          color="#0000aa"
          disabled={this.state.controls_disabled}
          toggleButtonCallback={this.toggleButtons}
        />

        <ToastContainer 
          hideProgressBar={true} 
          autoClose={1000} 
          transition={Flip}
          pauseOnHover={false}
          newestOnTop
        />
      </View>
    );
  }

}
