#!/bin/bash
###@fantasyhujian###
num=1
while true
do
adb shell sendevent /dev/input/event1 1$((0x14a)) $((0x01))
adb shell sendevent /dev/input/event1 3$((0x30)) $((0xc8))
adb shell sendevent /dev/input/event1 3$((0x35)) $((0x186))
adb shell sendevent /dev/input/event1 3$((0x36)) $((0x1d1))
adb shell sendevent /dev/input/event1 3$((0x32)) $((0x01))
adb shell sendevent /dev/input/event1 0$((0x02)) $((0x00))
adb shell sendevent /dev/input/event1 0$((0x00)) $((0x00))
##/***点击屏幕的解锁开始位置***/##
adb shell sendevent /dev/input/event1 3$((0x30)) $((0xc8))
adb shell sendevent /dev/input/event1 3$((0x35)) $((0x186))
adb shell sendevent /dev/input/event1 3$((0x36)) $((0x31d))
adb shell sendevent /dev/input/event1 3$((0x32)) $((0x01))
##/***下拉滑动解锁***/##
adb shell sendevent /dev/input/event1 0$((0x02)) $((0x00))
adb shell sendevent /dev/input/event1 0$((0x00)) $((0x00))
adb shell sendevent /dev/input/event1 3$((0x30)) $((0x00))
adb shell sendevent /dev/input/event1 1$((0x14a)) $((0x00))
adb shell sendevent /dev/input/event1 0$((0x00)) $((0x00))
##/***离开触屏,完成解锁***/##
sleep 2
adb shell sendevent /dev/input/event0 1$((0x74)) $((0x01))
adb shell sendevent /dev/input/event0 0$((0x00)) $((0x00))
adb shell sendevent /dev/input/event0 1$((0x74)) $((0x00))
adb shell sendevent /dev/input/event0 0$((0x00)) $((0x00))
##/***模拟按键锁屏，然后按开机键亮屏***/##
sleep 2
num=$(($num+1))
echo $num
done
##/***循环计数***/##