import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

const DAILY_REMINDER_KEY = 'dailyReminderScheduled:v1'
const DEFAULT_CHANNEL_ID = 'default'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})

let notificationChannelReady = false

const ensureNotiReady = async () => {
    if (Platform.OS === 'android' && !notificationChannelReady) {
        await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
            name: 'Default',
            importance: Notifications.AndroidImportance.DEFAULT,
        })
        notificationChannelReady = true
    }

    const perms = await Notifications.getPermissionsAsync()
    if (perms.status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync()
        if (req.status !== 'granted') return false
    }

    return true
}

const scheduleDailyReminder = async (hour = 17, minute = 0) => {
    const alreadyScheduled = await AsyncStorage.getItem(DAILY_REMINDER_KEY)
    if (alreadyScheduled === '1') return

    const ok = await ensureNotiReady()
    if (!ok) return

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Reminder',
            body: 'Add a new image to interpret today.',
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
            ...(Platform.OS === 'android' ? { channelId: DEFAULT_CHANNEL_ID } : null),
        },
    })

    await AsyncStorage.setItem(DAILY_REMINDER_KEY, '1')
}

const disableDailyReminder = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync()
    await AsyncStorage.removeItem(DAILY_REMINDER_KEY)
}

export { scheduleDailyReminder, disableDailyReminder }