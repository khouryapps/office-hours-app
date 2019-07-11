/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import { shallow, mount, render } from 'enzyme';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<App />);
});

it('Enzyme renders app', () => {
  shallow(<App />);
});

//
// Try doing snapshot tests for the props and State of each interaction
//


// Test that given a list of office hours the first one shows on the TA screen

// Test that hitting the button for I am here correctly redirects the user to the office hours

// Test clicking on a button to help a student


