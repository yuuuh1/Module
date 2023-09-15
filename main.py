import json
import os
import time

from happy_python import get_exit_code_of_cmd, HappyLog, HappyConfigParser, HappyConfigBase

__nod_config_file_path__ = '/home/mk/workspace/Module/conf/111.conf'
hlog = HappyLog.get_instance()
wcbsite_details = []


class Config(HappyConfigBase):
    def __init__(self):
        super().__init__()

        self.section = '111'
        self.node_exec_path = ''
        self.node_exec_script_path = ''
        self.google_chrome_path = ''
        self.browser_url = ''
        self.node_js_command_line_parameters = ''
        self.env_node_modules_path = ''
        self.json_path = ''
        self.jpg_path = ''


def main():
    conf = __nod_config_file_path__
    browser_conf = Config()
    HappyConfigParser.load(conf,browser_conf)
    hlog.info(browser_conf.google_chrome_path)

    node = browser_conf.node_exec_path
    js = browser_conf.node_exec_script_path
    chrome = browser_conf.google_chrome_path
    url = browser_conf.browser_url
    json11 = browser_conf.json_path
    jpg = browser_conf.jpg_path

    node_modules_path = browser_conf.env_node_modules_path
    node_js_command = '%s %s %s %s %s %s ' % (node, js, chrome, url, json11, jpg)
    hlog.info(node_js_command)

    os.putenv('NODE_PATH', node_modules_path)
    code = get_exit_code_of_cmd(cmd=node_js_command, is_show_error=True, is_show_output=True)
    os.unsetenv('NODE_PATH')

    if code != 0:
        return "error"

    time.sleep(5)

    with open(json11) as f:
        log_entries = json.load(f)['log']['entries']
        for i in log_entries:
            wcbsite_details.append(i['request']['url'])

    hlog.info(wcbsite_details)
    hlog.info(len(wcbsite_details))


if __name__ == '__main__':
    main()
