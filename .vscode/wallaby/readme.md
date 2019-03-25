# Wallaby vscode setup

## Choosing project

1. Use command `Tasks: Run Task`

![image](https://user-images.githubusercontent.com/5224266/54906788-4e9e0680-4ee4-11e9-9ec7-f91dd5ff9cd2.png)

2. Choose `wallaby-setup`

![image](https://user-images.githubusercontent.com/5224266/54906857-80af6880-4ee4-11e9-98f5-37b0833c08ee.png)

3. Choose desired project

![image](https://user-images.githubusercontent.com/5224266/54918247-0390ed00-4efe-11e9-87d1-67e61fe7a5da.png)

4. Terminal output will show you the input and let you know if something went wrong

![image](https://user-images.githubusercontent.com/5224266/54918375-5bc7ef00-4efe-11e9-8e0c-0a091f102df3.png)

## Choose single file

1. Use command `Tasks: Run Task`

![image](https://user-images.githubusercontent.com/5224266/54906788-4e9e0680-4ee4-11e9-9ec7-f91dd5ff9cd2.png)

2. Choose `wallaby-single-file-setup`

![image](https://user-images.githubusercontent.com/5224266/54918137-c593c900-4efd-11e9-83d8-ee5871dd4264.png)

3. Choose desired project

![image](https://user-images.githubusercontent.com/5224266/54918247-0390ed00-4efe-11e9-87d1-67e61fe7a5da.png)

4. Enter the name of the file without the `.spec.ts` extention

![image](https://user-images.githubusercontent.com/5224266/54918281-1c999e00-4efe-11e9-89e2-a1c56bd59054.png)

5. Terminal output will show you the input and let you know if something went wrong

![image](https://user-images.githubusercontent.com/5224266/54918329-3f2bb700-4efe-11e9-831f-aeb4e38a45a3.png)

## Use vscode settings file for wallaby

1. Use command `Wallaby.js: Select Configuration File`

![image](https://user-images.githubusercontent.com/5224266/54906611-f23ae700-4ee3-11e9-8f79-b5192ec46a9c.png)

2. Choose `wallaby-vscode.js`

![image](https://user-images.githubusercontent.com/5224266/54906686-1991b400-4ee4-11e9-9420-634e7cf225ca.png)

## Adding new projects

1. Add the project to the task option list

![image](https://user-images.githubusercontent.com/5224266/54932252-c555f680-4f1a-11e9-81d5-fcf92d7d7035.png)

2. If the project is an app and not a lib, add it to the apps array in `wallaby-setup.js`

![image](https://user-images.githubusercontent.com/5224266/54932241-c25b0600-4f1a-11e9-8dd3-ea4cd63e905a.png)
