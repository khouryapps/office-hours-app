import TAHomeScreen from "./TAHomeScreen";
import QueueScreen from "../QueueScreen/QueueScreen"
import { createDrawerNavigator } from "react-navigation";

const TAHomeScreenRouter = createDrawerNavigator(
    {
        Home: { screen: TAHomeScreen },
        QueueScreen: {screen: QueueScreen }
        // OfficeHoursOverview: { screen: OfficeHoursOverview }
        // this screen should contain the queue code, current queue size, how quickly students are being helped
    },
);

export default TAHomeScreenRouter;