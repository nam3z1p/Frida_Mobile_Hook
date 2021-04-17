# -*- coding: utf-8 -*-
import frida
import sys
import time
import argparse
import textwrap
import os

# from imp import reload
# reload(sys)
# sys.setdefaultencoding('cp949')


def Main_title():
    print("######################################################")
    print("##           TeamCr@k Frida Hooking 0.2             ##")
    print("##                                                  ##")
    print("##                            Developed by nam3z1p  ##")
    print("##                                         2017.12  ##")
    print("######################################################")


def Menu():
    parser = argparse.ArgumentParser(
        prog='Frida_Mobile_Hook_v0.2.py',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        description=textwrap.dedent(""))

    parser.add_argument('-i', '--scriptname', type=str,
                        help='scriptname', metavar="scriptname")
    parser.add_argument('-s', '--spawn',
                        action='store_true', help='spawn')
    parser.add_argument('-c', '--classdump',
                        action='store_true', help='classdump')
    parser.add_argument('package', type=str, help='package')

    args = parser.parse_args()
    return args


class FRIDAHOOK:
    def __init__(self):
        self.Classdump_filename = ".\dump\classdump.log"

    def On_Message(self, message, payload):
        try:
            if message:
                print("[Hooking] {0}".format(message['payload']))
        except Exception as e:
            print(message)
            print(e)

    def ClassDump_Message(self, message, payload):
        try:
            if message["type"] == "send":
                if message['payload']:
                    f = open(self.Classdump_filename, 'a')
                    data = "{0}\n".format(message['payload'])
                    f.write(data)
                    f.close
                    print("[Hooking] {0}".format(message['payload']))
        except Exception as e:
            print(message)
            print(e)

    def Pause_Exit(self, retCode, message):
        sys.exit(retCode)


def Main():

    Main_title()

    arguments = Menu()
    hook_package = arguments.package
    scriptname = arguments.scriptname

    if arguments.scriptname:
        with open(scriptname, "r") as f:
            jscode = f.read()
    else:
        print("[-] ScriptName not exist. Plz input '-i' option'")
        exit(0)

    print('[+] Running')

    try:
        # device = frida.get_device_manager().enumerate_devices()[-1]
        device = frida.get_usb_device(timeout=10)
        print('[+] Hooking ({}) is starting. '.format(hook_package))
    except Exception as e:
        print(e)

    if arguments.spawn:
        pid = device.spawn([hook_package])
        session = device.attach(pid)
    else:
        session = device.attach(hook_package)

    script = session.create_script(jscode)

    if arguments.classdump:
        if not os.path.exists(".\dump"):
            os.makedirs(".\dump")
        if os.path.exists(FRIDAHOOK().Classdump_filename):
            os.remove(FRIDAHOOK().Classdump_filename)

        script.on('message', FRIDAHOOK().ClassDump_Message)
    else:
        script.on("message", FRIDAHOOK().On_Message)

    script.load()
    if arguments.spawn:
        device.resume(pid)
    sys.stdin.read()


if __name__ == "__main__":
    Main()
