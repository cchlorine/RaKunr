上个星期因为需求折腾了个 [Git](https://git-scm.com) 的 Webhook 来实现自动部署，因为我是 PHP 环境，所以直接用 PHP 写了个。

![Git Webhook 工作原理](https://hime.io/images/2015/03/14/1290128163559516.png)

## 服务端
### 生成 key
```
   sudo -u apache ssh-keygen -t rsa -C "example@example.com"
```
**apache** 为运行脚本的用户， **example@example.com** 为邮箱，请根据实际需求替换。

### 权限
#### 777权限
```
  chmod -R 777 /path/to/your/repo
```
**/path/to/your/repo** 就是乃网站目录啦~
#### 用户组
当然你也可以不上777，用用户组的方式，推荐这种方式。
```
  groupadd gitwriters
  adduser [yourusername] gitwriters
  adduser apache gitwriters
  chgrp -R gitwriters /path/to/your/repo
  chmod -R g+rw /path/to/your/repo
```

### 脚本
接下来上面的都配置了，那就剩下脚本了。

我的脚本是这样的：
#### Update.php
```
<?php
/* gitlab deploy webhook */
/* file.php?token=tokenasdfasogusdf9u831ihjneuijandbfjAUSIHDirkn3wri*/

/* security */
$access_token = 'tokenasdfasogusdf9u831ihjneuijandbfjAUSIHDirkn3wri';
$access_ip = array('');

/* get user token and ip address */
$client_token = $_GET['token'];
$client_ip = $_SERVER['REMOTE_ADDR'];

/* create open log */
$fs = fopen('./webhook.log', 'a');
fwrite($fs, 'Request on ['.date("Y-m-d H:i:s").'] from ['.$client_ip.']'.PHP_EOL);

/* test token */
if ($client_token !== $access_token)
{
    echo "error 403";
    fwrite($fs, "Invalid token [{$client_token}]".PHP_EOL);
    exit(0);
}

/* test ip */
if ( ! in_array($client_ip, $access_ip))
	{
    echo "error 503";
    fwrite($fs, "Invalid ip [{$client_ip}]".PHP_EOL);
    exit(0);
	}

/* get json data */
$json = file_get_contents('php://input');
$data = json_decode($json, true);

/* get branch */
$branch = $data["ref"];
fwrite($fs, '=======================================================================' . PHP_EOL);
/* if you need get full json input */
//fwrite($fs, 'DATA: '.print_r($data, true).PHP_EOL);


fwrite($fs, 'BRANCH: '.print_r($branch, true).PHP_EOL);
fwrite($fs, '=======================================================================' . PHP_EOL);
$fs and fclose($fs);
exec("sh /home/wwwroot/.deploy/deploy.sh");
```

**token** 和 **access_ip** 设置一下，然后再创建个 deploy.sh 的文件。

注意上面的文件位置自己改一下。

#### deploy.sh
```
#!/bin/bash

cd /path/to/your/repo
git checkout master
git pull origin master >> /home/wwwroot/.deploy/deploy.log
echo "" >> /home/wwwroot/.deploy/deploy.log
```

## Gitlab
这个直接添加一下你 update.php 所在的地址要包括 token，然后添加一下 ssh 公匙就行了~
