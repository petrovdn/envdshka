/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict'
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

/**
 * The actions we need
 */
import * as envdboxActions from '../reducers/envdbox/envdboxActions'
import * as globalActions from '../reducers/global/globalActions'
import * as profileActions from '../reducers/profile/profileActions'

/**
 * Router
 */
import {Actions} from 'react-native-router-flux'

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header'

/**
 * The components needed from React
 */
import React, {Component} from 'react'
import
{
  StyleSheet,
  View
}
from 'react-native'

import EnvdList from '../components/envd/EnvdList'
import Step1 from '../components/envd/Step1'
import Step2 from '../components/envd/Step2'
import Step3 from '../components/envd/Step3'
import Step4 from '../components/envd/Step4'

/**
 * The platform neutral button
 */
const Button = require('apsl-react-native-button')

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps (state) {
  return {
    envdbox: {
      form: {
        state: state.envdbox.form.state,
        envdlist: state.envdbox.form.envdlist,
        Activitylist: state.envdbox.form.Activitylist,
        disabled: state.envdbox.form.disabled,
        error: state.envdbox.form.error,
        isValid: state.envdbox.form.isValid,
        isFetching: state.envdbox.form.isFetching,
        isChanged: state.envdbox.form.isChanged,
        fields: {
          inn: state.envdbox.form.fields.inn,
          year: state.envdbox.form.fields.year,
          name: state.envdbox.form.fields.name,
          lastName: state.envdbox.form.fields.lastName,
          patronymic: state.envdbox.form.fields.patronymic,
          address: {
            subjectCode: state.envdbox.form.fields.address.subjectCode,
            index: state.envdbox.form.fields.address.index,
            district: state.envdbox.form.fields.address.district,
            city: state.envdbox.form.fields.address.city,
            town: state.envdbox.form.fields.address.town,
            street: state.envdbox.form.fields.address.street,
            house: state.envdbox.form.fields.address.house,
            building: state.envdbox.form.fields.address.building,
            flat: state.envdbox.form.fields.address.flat
          },
          ifns: state.envdbox.form.fields.ifns,
          okved: state.envdbox.form.fields.okved,
          activityType: state.envdbox.form.fields.activityType,
          quarter: state.envdbox.form.fields.quarter,
          k2: state.envdbox.form.fields.k2,
          factors: state.envdbox.form.fields.factors,
          taxRate: state.envdbox.form.fields.taxRate,
          insurancePayments: state.envdbox.form.fields.insurancePayments,
          taxDecrease: state.envdbox.form.fields.taxDecrease,
          taxBeforeInsurance: state.envdbox.form.fields.taxBeforeInsurance,
          taxToPay: state.envdbox.form.fields.taxToPay
        }
      }
    },
    global: {
      currentUser: state.global.currentUser,
      showState: state.global.showState
    }
  }
}

/*
 * Bind all the actions
 */
function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators({ ...envdboxActions, ...globalActions, ...profileActions }, dispatch)
  }
}

/**
 * ### Translations
 */
var I18n = require('react-native-i18n')
import Translations from '../lib/Translations'
I18n.translations = Translations

class EnvdBox extends Component {

  handleSteps (direction, currentstep, value) {
    switch (currentstep) {
      case 'step0':
        this.props.actions.step1State()
        return
      case 'step1':
        if (direction === 'forvard') {
          this.props.actions.addStep1Data(value)
          this.props.actions.step2State()
        } else {
          this.props.actions.envdlistState()
        }
        return
      case 'step2':
        if (direction === 'forvard') {
          this.props.actions.step3State()
        } else {
          this.props.actions.step1State()
        }
        return
      case 'step3':
        if (direction === 'forvard') {
          this.props.actions.step4State()
        } else {
          this.props.actions.step2State()
        }
        return
    }
  }

  handlePressAddEnvd () {
    this.handleSteps('forvard', 'step0')
  }
  /**
   * ### componentDidMount
   *
   * During Hot Loading, when the component mounts due the state
   * immediately being in a "logged in" state, we need to just set the
   * form fields.  Otherwise, we need to go fetch the fields
   */
  componentDidMount () {
    this.props.actions.getEnvdList(this.props.global.currentUser)
    this.props.actions.getActivitylist(this.props.global.currentUser)
  }

  render () {
    switch (this.props.envdbox.form.state) {
      case 'ENVDLIST':
        return (
          <View style={styles.container}>
            <View>
              <Header isFetching={this.props.envdbox.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState} />
              <Button style={styles.button} onPress={this.handlePressAddEnvd.bind(this)}>
                {I18n.t('envdbox.addenvd')}
              </Button>
              <EnvdList
                envdlist={this.props.envdbox.form.envdlist}
                addEnvd={this.handlePressAddEnvd.bind(this)} />
            </View>
          </View>
        )
      case 'STEP1':
        return (
          <View style={styles.container}>
            <Step1
              inn={this.props.envdbox.form.fields.inn}
              name={this.props.envdbox.form.fields.name}
              lastName={this.props.envdbox.form.fields.lastName}
              patronymic={this.props.envdbox.form.fields.patronymic}
              okved={this.props.envdbox.form.fields.okved}
              handleSteps={this.handleSteps.bind(this)} />
          </View>
        )
      case 'STEP2':
        return (
          <View style={styles.container}>
            <Step2
              handleSteps={this.handleSteps.bind(this)} />
          </View>
        )
      case 'STEP3':
        return (
          <View style={styles.container}>
            <Step3
              handleSteps={this.handleSteps.bind(this)}
              Activitylist={this.props.envdbox.form.Activitylist}
              activityType={this.props.envdbox.form.activityType} />
          </View>
        )
      case 'STEP4':
        return (
          <View style={styles.container}>
            <Step4
              handleSteps={this.handleSteps.bind(this)}
              city={this.props.envdbox.form.fields.city}
              street={this.props.envdbox.form.fields.street}
              house={this.props.envdbox.form.fields.house}
              building={this.props.envdbox.form.fields.building}
              flat={this.props.envdbox.form.fields.flat}/>
          </View>
        )
    }
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    marginBottom: 80,
    flexDirection: 'column',
    flex: 1
  },
  summary: {
    fontFamily: 'BodoniSvtyTwoITCTT-Book',
    fontSize: 18,
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#6ec740',
    borderColor: '#6ec740',
    marginLeft: 10,
    marginRight: 10
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EnvdBox)