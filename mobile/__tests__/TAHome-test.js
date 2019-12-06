import {shallow, mount} from "enzyme/build";
import TAHomeScreen from "../src/TA/HomeScreen/TAHomeScreen";
import React from "react";


describe('Testing TA Home Screen', () => {
    beforeEach(() => {
        fetch.mockReset()
    });

    it('Renders without crashing', () => {
        fetch = jest.fn(() => new Promise(resolve => resolve()));
        const component = shallow(<TAHomeScreen/>);
        expect(component).toMatchSnapshot()
    });

    it('Renders the correct number of office hours', () => {
        fetch.mockResolvedValueOnce({"json": function() {return [{"id":9,"course":"CS 0130","room":"KA 110","ta_name":"Will Stenzel","ta_photo":"","campus":116,"semester":"Fall 2009","queue":null,"start":"2019-07-15T12:35:55.054762-04:00","end":"2019-07-15T16:35:55.054770-04:00","swap":null,"canceled":false,"ta_arrived_on":null,"ta_departed_on":null},{"id":6,"course":"CS 0141","room":"RY 154","ta_name":"Will Stenzel","ta_photo":"","campus":116,"semester":"Fall 2009","queue":null,"start":"2019-07-15T16:16:27.490635-04:00","end":"2019-07-15T21:16:27.490656-04:00","swap":null,"canceled":false,"ta_arrived_on":null,"ta_departed_on":null},{"id":10,"course":"CS 0141","room":"RY 154","ta_name":"Will Stenzel","ta_photo":"","campus":116,"semester":"Fall 2009","queue":null,"start":"2019-07-16T15:35:55.076501-04:00","end":"2019-07-16T20:35:55.076522-04:00","swap":null,"canceled":false,"ta_arrived_on":null,"ta_departed_on":null}]}})
        const component = mount(<TAHomeScreen/>);
        expect(component).toMatchSnapshot()
    });
});
