
'use strict';

var React = require('react-native');
var MultiPickerIOS = require('react-native-multipicker');
var { Group, Item } = MultiPickerIOS;

var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions
} = React;

var SCREEN_WIDTH = Dimensions.get('window').width;

var Component = React.createClass({
  show: function(){
    this.setState({modalVisible: true});
  },
  getInitialState: function(){
    return {
      options: this.props.options,
      groups: this.props.groups,
      selectedOptions: [],
      color: this.props.color || '#007AFF',
      modalVisible: false,
      onChanges: this.props.onChanges
    };
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      groups: nextProps.groups,
    });

    if(this.state.selectedOptions.length === 0){
      var initialSelectedOptions = nextProps.groups.map((group) => { return group.options[0]; });
      this.setState({
        selectedOptions: initialSelectedOptions
      });
    }
  },
  componentDidMount(){
    console.log("mounting")
  },
  renderGroups(){
    return this.state.groups.map((group, i) => {
      return (
        <Group onChange={this.setSelectedOption.bind(this, i)}>
          {this.renderOptions(group.options)}
        </Group>
      )
    });
  },
  renderOptions(options){
    return options.map((option, i) => {
      return (<Item value={option} label={option}/>)
    });
  },
  setSelectedOption(i, val){
    var selectedOptions = this.state.selectedOptions;
    selectedOptions[i] = val.newValue;
    this.setState({selectedOptions: selectedOptions})
    if(this.props.onChanges && this.props.onChanges[i]){
      this.props.onChanges[i](val);
    }
  },
  render: function() {
    return (
      <Modal
        animated={true}
        transparent={true}
        visible={this.state.modalVisible}>
        <View style={styles.basicContainer}>
          <View style={styles.modalContainer}>
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={() => {this.setState({modalVisible: false});}}>
                <Text style={{color:this.state.color}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                console.log("selected options", this.state.selectedOptions);
                if(this.props.onSubmit) this.props.onSubmit(this.state.selectedOptions);
                  this.setState({modalVisible: false});
                }}>
                <Text style={{color:this.state.color}}>Confirm</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mainBox}>
              {/*Model body*/}
              <MultiPickerIOS
                ref='picker'
                style={styles.bottomPicker}>
                  {this.renderGroups()}
              </MultiPickerIOS>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  basicContainer:{
    flex: 1,
  },
  modalContainer:{
    position:'absolute',
    bottom:0,
    right:0,
    left:0,
    width:SCREEN_WIDTH,
    padding:0,
    backgroundColor: '#F5FCFF',
  },
  buttonView:{
    width:SCREEN_WIDTH,
    padding: 8,
    borderTopWidth:0.5,
    borderTopColor:'lightGray',
    justifyContent: 'space-between',
    flexDirection:'row',
  },
  bottomPicker : {
    width:SCREEN_WIDTH,
    fontSize:13
  },
  mainBox: {}
});

module.exports = Component;
