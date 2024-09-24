1) Add a emailConfig.js 

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const envConfig = require("./envConfig");

const environment = process.env.NODE_ENV || 'dev';
const { smtp } = envConfig[environment];

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure,
  auth: {
    user: smtp.user,
    pass: smtp.pass
  }
});

const getEmailTemplate = (uname, credential, firstName, activationLink) => {
    const templatePath = path.join(__dirname, 'template', 'welcome_email_template.html');
    let template = fs.readFileSync(templatePath, 'utf-8');

    template = template.replace('{{uname}}', uname);
    template = template.replace('{{password}}', credential);
    template = template.replace('{{firstName}}', firstName);
    template = template.replace('{{activationLink}}', activationLink);

    return template;
};

const getInvitePeerEmailTemplate = (templateName,replacements) => {
     const templatePath = path.join(__dirname, 'template', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf-8');
   
    for (const key in replacements) {
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    }

    return template;
};

module.exports = { transporter, getEmailTemplate ,getInvitePeerEmailTemplate};

2) Add a envConfig.js :- 

module.exports = {
  dev: {
    port: 8181,
    host: 'localhost',
    baseUrl: 'http://localhost:8181',  // port number of server 
    clientBaseUrl: 'http://localhost:3000', // port number of client 
    smtp: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      user: '',
      pass: ''
    }
  },
  test: {
    port: 8181,
    host: '0.0.0.0',
    baseUrl: '',
    clientBaseUrl: '',
    smtp: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      user: '',
      pass: ''
    }
  },
};

3) Below is the part of code which will be used in sending the email use accordingly as per the requirement 

const { transporter, getEmailTemplate } = require('../../config/emailConfig');

 const environment = process.env.NODE_ENV || 'dev';
      const { baseUrl } = envConfig[environment];

   
      const encodedUserId = Buffer.from(keycloakUser.id).toString('base64');

      const generateActivationLink = (encodedUserId) => {
      return `${baseUrl}/api/user/activate-user?userId=${encodeURIComponent(encodedUserId)}`;
      };

      const activationLink = generateActivationLink(encodedUserId);
  
    let mailOptions = {
        from: '"M12Planner" <no-reply@m12-planner.ai>',
        to: userData.USER_ID,
        subject: 'Welcome to M12 Planner',
        text: 'Hello, your account has been created successfully.',
        html: getEmailTemplate(userData.USER_ID, randomPassword, userData.USER_FIRST_NM,activationLink),
    };
 
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
 
      return h
        .response(
          responseHelper.createResponse(
            responseStatus.success.message,
            responseStatus.success.code,
            constants.MESSAGE_USER_SAVE_SUCCESS,
            {}
          )
        )
        .code(responseStatus.success.code);
    } catch (error) {
      await trx.rollback();
      return h
        .response(
          responseHelper.createResponse(
            responseStatus.error.message,
            responseStatus.error.code,
            error.message,
            {}
          )
        )
        .code(responseStatus.error.code);
    }
  },


4) in our case this email template is getting used in sending the email we can use any Just we need to change the file name in emailConfig.js :- welcome_email_template.html

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Creation Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            align-items: center;
            padding-bottom: 20px;
        }

        .header img {
            width: 30px;
            margin-right: 20px;
        }

        .logo-img {
            max-width: 40px;
            max-height: 40px;
        }

        .sub-img {
            margin: 0px 10px;
        }

        .content {
            margin-left: 60px;
        }

        .content h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }

        .content p {
            font-size: 16px;
            color: #555555;
        }

        .account-info {
            background-color: #f1f6fd;
            padding: 10px;
            margin: 20px 0;
            border-radius: 5px;
            font-size: 16px;
            text-align: left;
            position: relative;
        }

        .account-info p {
            margin: 5px 0;
            line-height: 1.5;
        }

        .account-info .activate-button {
            position: absolute;
            right: 10px;
            top: 20px;
        }

        .activate-button {
            display: inline-block;
            background-color: #4285f4;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            padding-top: 20px;
        }

        .footer a {
            color: #888888;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <img class="logo-img"
                src="data:image/jpeg;base64,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"
                alt="M12Planner Logo">
        </div>
        <div>
            <img class="sub-img"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAjIAAACvCAYAAADnqzTtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAD+pSURBVHgB7Z3nkxvpnd+/QHejkcPkRA7jkNxl2ERq82qVVjqFSzrXla/K5XK5fC7/BX7pP8Auh1cuh/LVlct+cdbVRUkrrbK0OTJncjiJk5FTdwN+fk8DRHM4ATODOPP7rKABhhgMMGg8z7e/v+QqC8AwDMMwDNOFuMEwDMMwDNOlsJBhGIZhGKZrYSHDMAzDMEzXwkKGYRiGYZiuhYUMwzAMwzBdCwsZhmEYhmG6FhYyDMMwDMN0LSxkGIZhGIbpWljIMAzDMAzTtbCQYRiGYRima2EhwzAMwzBM18JChmEYhmGYroWFDMMwDMMwXQsLGYZhGIZhuhYWMgzDMAzDdC0sZBiGYRiG6VpYyOxBSmXALINhGIZh9jwqmD1FsQRM5QBLCJkxH+BXwDAMwzB7FhYye4yUaYsYImOxkGEYhmG2R07sHQnTvt6rAVqHx25YyOwx0mbtupcDh8weo1wSluPysoifWnD19QMKK3WGaRR0ErxUBJJiHylXTog9Yh+JugC3Cx0LC5k9BLkxhZJ9XREHXYDXeGaPUZ6bhfXeh+IUUYPy4gW4aHEVK64rFAJ8ftjfYBhmO1Be5arYP1aL9nUnVgkdDwuZPcRSoXY9rHW2gmaYnWD++newrl8Wqj2FEjkzliWFjHLyBJQvCWGj62AYpn5WDSAuLsYGgoW+3em1Iyxk9gjzQsQYlaON3BiKazLMXsPl8wnbsSDFS+nSZ/Y3xfdcsRgUEjUMw9RF2rJPfotrBAw5+bpiixtyZ0pdUAHLWRR7AAopJYza7T6d3Rhmb6Kcfw6uwSFxgDuWLt0H5dgRuDRW7wyzFZTIS5Wtc7nHRQzlVA6IvSNYSe7tpi2EHZkuhw7EuXztdlC8oxF+V5k9int0DMoLF2CmU0A+j3JsEJ7zzwITJ1BW1a5afBmmlayXyEuo4kMT82x88tsNjgxveV1MtWdMFV2o6CFOEWBaBC1waxc/qipyuZtr9GoXnhcr8rK4VoDy/JfgGh5hN4ZhNiEpXJjFfK01B0GfXTrp1ZQn3RfnJ5h+ptO1jKtcLnMP2C7E2fiOoLyYcb+trhmm2ZBgufPzh0jP5+BcQnqOhDD8TC80n9rUAqJyMimC+QG4uPyaYbZkMluraCVIxPR5Ni7yIyGzULD3Fwo5jfg6e29hR6YLyVp2OMkpYg50+IHG7D0C/TpmPlqGma0l2Y683AfF42p6FbQrHAbDMPVBVazLjtJq+rpS3DykVKUbxt1wsm+XQQfjdO5JEePhd5JpIRQ+GjgdQ9/JENwVBT14Lopovw9uhQ9GhukkYkLIjHoBnyOMRAJlsWD3jlkbOyptcL1T4RWnS6CDjkJJJGSqsIhh2okiBMv4V4egVeZgDF3oEdcppMTWIMN0GiRiaL8Y9tn5lNVPKaUpUPuOtEG5JuhKOEemCyDx4hQwBB2Uw14OJzHtZ+4LEV4SAfhB4dA0OzeGYZjGsFEjvJBq95JZLNac/yOBzt5rWMh0KOTAJCoHmrXmHer12BeG6QQsqyTj7M2uVmIYprFsNJqAPs/O24f8ne38c7JvEyHLLicumqu+KdQkXmhidcZ8fPhjFbIDyYXhUBLTSSicE8MwXYm70gU+LPanZcNurlpep5tvdUxBp5oyLGSaiLM8miAhQh0TFdfjipcED12sDbwxEkI9Oje6YxpMQRygxhLVUtu31R7AG+TBiwzTAGgEADkdPrHm99RRHdROtEoPMhI1FFKik2nndtTpTfF4a2wia4UJ1fEXtpECTnkwVDbHAoZpCsYKCvd+hLKZlTf1gadR6n8Fbs23bxN2ryfLwvF0YcT/eEIkw2yX5YK93tNIAGr7r7s6/3giQTPitUXYcmUOEy0Faoc/d94imwjFFSmhKm/VL2BIvFAYihKuOITENBVNODAuBW5zCa6yhcK8BT18Fi4hZPYr90UsmBLr3xIfPl3rgp2H6Uho3a8O8VW7QAisJSj2oKDfFmGqu/OLSljINBESIoOVkQFkzVEODAmatZqG1ktPFxwszN6irOlwh8aE0p4SNywoQtDAWBSRppjQN52TTW4YpuwerGnNLe0mB/VBBjjos8O/DLNTkkYtHBP1dG+fE1+XNM5mIdMiKD7qcbHLwnQOVGWk9Z6282LKJoxsXByoDRzWlZ4Rwfb7YjUcQjlwYNviyDQtJM0V3E5dRtgTwzhOwKt5myZmqI37sjjb+EpYEWekLk4VYnYEzTWqdsOldT+sdnZ+zF6AhQzD7GPK/mERSuqRpQpatPJNd4MGMOamRLjqC2H2fAT90Fvi1PS4UE/1LTk0y2kqdwuXVt/DQ2MKI54jCGsxDGljwqJvzmki5cREhC36zsOSFDFpYdGciSg4H3MhqnIONFMfq4VafmRPF7sx3QT/jRlmHyN7v+giluL11y6N2rHD56TDQzk4yEwKYZOyazvr5HbqIuaNaWHRW8iaCfGjzW2WPuQFXu11y0TfY+JyNODC1YSF+XwZFhhma9iNaQ8sZBiGaQ5CIOmDT6Osj8CY+y3KKx8IMROvS8yQwOrRh4T3YrsvqnCJmr0fUF7M02EXvj6g4FVxCWsuhIRDo3L1ElMniUItN4aqTXmDbQ0cWmIYpmmUey/AnU0AiwsoLFyBHhiHyxdCvUtPTB1An3cYx8Nn0e8ZEme39YWVqNtwLl1EYakId9AFLaDC5/dC2eL0mMQMJThStcZsrozxoBu9HhdvSMyWUMlysWz3X6HDLNbhvWP2EixkGIZpGuSsuMe+BrcvAs3bD8s3JkSBUpfDcST4FA4FTiDkjkHTtLqTfItFE0tXE0jOZlGuJCsUkgaGzsXQezwC1aNsGT0zYDcFCytleBUuw2a2JlFkN6Zd8KwlhmH2FCv3kpj5eAnh0QD8vToKKRPphRzyq0WMvdaHntEw3FvUV9OGNJOzG1JSTw2ewsBsBrkx83k7yZdcGCrh5wrV1sGODMMwW1PIwfric1j3puDy+uA+egQu6phVNOAeGQICoY4p61m5m4bqVeGNeqBGFUQOBdBjhXDnx3PITOcR7PVB92/u8NBmNOKzv7IZw2zFWjeGe4K1FtaMDMNsiXX1uhAx02KVjqDs98G6fBmFv/0RjPc/gjU7R0kp6BR6jgTh1lyY+2wFc++vYPVOGrqqYvTZHuSTRSQmM49CTpvBESWmHnKVzu3VIyqkcal+q2FHhmGYrfHqcIVCcI+NQTl0AGVx+unR7OYq1CEYSue0AA2MeJETp8hUre2P6fAO6HCrfM7GNIe4UesbE9HsTu2sY1pL1woZqtWngVY0z8KstP2nmGRAYVuvnWQt+z2hD7O/S9pbM1vj8gixUi6I/+VQ9njF7VqX3k77uOm6B4OnY4gcDkLV3UJwKXBx+QjTBMiNoUvVjSEhw4da6+loIeMUK/Jr5bLVAMZej31hWodMjszbH+oq1Ck1qNrihr5PVj3djmmcCNdtuCJhuFQ/XPnitpratQtVVRCM1JQ0dQqmyiVyadSwwt4/0xCcbgwN+mU3pj10hJAhkZIr2VOi6aCoR6xsBk2vJVjMtI7F4uMihqD3sFCs3ab3NmHYFxI0fR4WNJ1IOZlE6dYtlGYfiDfNhLt/WKhQFaV4HO5Ad07GTq3mkJrPyVBTqMcnHBowzK5gN6ZzaKuQobP4hwUgbWLbKJXR6Jrbvk4HUNasCSASM6SQeaNsPiRESZxUoQ80vaeb5VPSv9OFBU1nUqacmFgvSnkD1tQMyqk0XGOjcE8ch0tr0CymFpFO5jH/ySossTgEnvKKcFNzp2gz+4MkrXGV67TX6NwBum20tY8MTZvdzHlRKtOilYpgIbba8OLF2mNyiKk1zBdqQoZEjLfi6Dvfi2Dlg54213/P6d+jGufVdAIUhnEZhcdCSOWiIQSMaufH7DKxl7ru0mO7FXfTBQW9ltXJNLLizCYwqiPc7xfmEh9kzO5x7l9jPrsjNAuZ9tA2IUOOybIj7EAbGYkV0im7KTAgd2C1WHvMES+YJkJ5THcztdvDXjvxmsiYj7tt1ZwZYiNBw+Jz72IYJqbztzGfn0bU04ejwVPQFB3Nhjr9mqYpq6xIxLAbwzSCVcPOkaGGib08jqCttC20FHeEImINDC04H6fAI2ubzlox6tQmAdWOIVdDTNWcmaqgCaKWCOx8PDqzYWdm70CuSNxYxu8WfoTZ4n3h2PlwqHQSh4Mn0Ao8HlVeGKaRUNFCrLuirHuWtny66Sy+urlVw0c7epxS7bHoQjk3psNfMnj4QlMxy4/nxoTWCBkiqj3pvjgFjV+1RYvzPhmLhcxeguYtkekeUCLCcbU/7D36IBQ3v8kMw+yejj9N2UisWHWKFAo1cSJpc1h1iJjgOiKGoDBh1GO/j5sJmpLj/ayGBulsh3sC7Q1ieh9e7HkLoVQEc/lJ9Gj9cnhkI6CQFV0oZOT1ejh0xDD7jLblyNxM165TaKnkECvVBndWA54ZJWHx2X3jWZsbM1hnLhK9t2vDSRtBbt0BHr62pyDBkbJWEXRHtjXR2gmFqgzTQkl8dQu3Z2U+hcnbC1hdyWBwNIaJp4fhD3pZ0DDMPqFtjgydhVfPzleL2BHrlWDTnlco1ZJMObzUHJxujG8bQpEcmrDbFpfrCRpqKFV9z0jIzuWBcT+YPYKmqdKN2SlU8bSymMT0vSX4/DqOjgVhrUzi3nu/gQcp3LkyitTSOZx7bQLhsJ/FDMPsA9omZEh81NP0biOxslllkzNPpriLxnrM+tDfN+kQMuEdJLw5BU31/aL3ufq+LhVsIUPHCIcHGUKWUgsR89nvbmPq3iJeeTEGc2URveVJ/NHXFzD1AFhZuYXpz8u4qqt47vVT0PXGLXHkGi+L4/5GwoIlVqETYRcGuFqFYdpOW4VMlfXEym42LufCYrCQaTgJR1tu3y7DdiRctjoIeaNoPyQikuksZu+uYHU5DVVTcPDoAAaGonArrXmDcnkDFz+ZlG4MiZgDgc9w/d1ZTD/0wCrZsc2BWB4jA7fxyW90jE+MYPhAT8PmLCWEy/uDaQtfCCFjlC306S78+WEV4z4XH6MM00baJmScQoU2w0ADn4nzsVnINBY6K43v0o3ZCsqjqQolCkFywm97oT4sF9+/gw9/eR2meGPCER8Mw8JP/voTHDzSj7f++DwGhiNNHcxIQiqbzOH2xSmcfHUII4GP8cMfpTFfOIfxk2MIBXTk0gXcvvUBnjmyjJgyhdnJefQNReBpgCtDx+N8royL8ZLs6Eoslsu4smphWFfgVfggZZh20T5HxvG5t5qYx1JgIdNQVhvoxmyEUyj1cHO8tpLNFvCLv/kUd6/P4eRrA7jQewk+awYu4Ug8mFLw4eUQ/uq/JfAnf/5VIWaiTctJMYS6vXF5BqpHxenoNN77eQJJ9wS+989exejBHpTFf+QUvS0un9y8JJ6fgXs35hCIhOHzexAO+xDtC+7KPfKIn1378gIeN+fhMEybaZuQcZ5lNyOPhdar6oZLORh8Vr972uHGhLiPWdsoFIr43duX8XA2jj/4wwEMmr/AlYt5TM97cXjMwNHDJr5/II6/eec2PvrlEL76B+dlAu5OIdelWoZvWXYWONVUuoXTk0sVcE+IqSMnhqEU3xPPwYeX3+rHkDuJ+zfyyIkzltuXp2QOTfqWgbJpIjZzERcfzMAt4peL5SDOvnIcZy8cQmgHScC0ngyI6NVXB934+YKFvDhOz4bdOBdxcf4Ww2wTOiGmzu/UZyzQgGH0HRFaaoYjQ49frYghocTjVXaP043Rm7R4O4VSlN2YtkHVQQ+nErgmQjlfe3MQPfgcf/tTL2bTx3HiuWPQzvYijQU8eO+nOH04g59euY8X3ngKXt/WfVyoBJu6PpQdosUyyigWTCTiWZgilEXX87kiUoksDvYbGEkJB2ZhFQNnA7h1aRmJKeHWvfMLcTzm8P58LwoLcYSzKzhu5eGqzCMOL+fhvm9fLwQO4O3JRVz/fBIXvnwKp86OQdO3p8SpFf23BhW83KvIkDWN4+ATJIbZHrSHUKUyGQxUuTokPkehXYqZtp7vOkttG43TQeYS7MbQCpFRFUp0bETYjWkbhYKBy5/cx6GjAxjtW8QP/y6HYugM/sk/fwGxnrA4MVCQjPfh09tXcf74JPTCEhaFcxPpCUqRkksXUcgZyOcNZNP5R6Ikk8ghlcwjLa4X8iYymby8n0sIFVe5BHc2BSWRogZX8nn0mCloWEVRCJb86Mvwf6cfOVcZAyvzcE3dRlEt4auWIn6nC15Yj0RMFQXC5YEbuayGd6djWE0VMXV3GWfPH8Jzr0zgwNF+qNsY7kbhVLqQc8QJvgyzfWhvphNhMl3p0/owL/5vl2KmrVsFrR9GxTWhkILawLN8pcmhq/0GVWw4RUYziDv6CfU0f5YgswHVxNqZu/N47dVezF+7grn0Abz17TNYeZjBvWsLQsTkEF9KYWpZFc5NP1ZyLtz7r7+E16tByQgxkklgVRw0PUKAKBVx0aO7EC0kEBOuCWW1hMvCMZFfC/JrCMYjIVIVJVUhsgif/H4mqyIkrJG4HkIi60WfmZP33Qgqk86LR7ni7kfRpcASrysjLtSL5vqlaSFmjuH5F4+jbziyrfwZFjEMs3PIhZnNQYZo6RO/UBAiRrddz52ImbYKGWf4p9Fag0uwGwv1danSLJFRTcxmN6Y9VJvNUZ+WO9ceIpnMwucL49q0hsj1a4j+x3fxy5WwsIPtM45QPoGXK6EcKUoWHhclPpiPhAkJEpexye+WP7X+94kgilBzKcxmTVw4HAViwLVkP86ZDxEW/+bCxrbrdXcfrrn6Hj0WkaYKqCszQoSt4FPxel968xSef+M4N9FjmBZA5wxSzOTtdZ8cznmxxyhe2/Hc7iewrduFV6kNHTQa3PTM+VAWh5Z2hdONaVZuzEoLhBKzMeTC0Kb+47/6GIpYZZTpSbgCMcTCIvyT1xDIJeFevoc3yiQZ1g/jbIaF3R049PuOJmZx6zcP8dyfDuFb313C3//1OLIPdbxoPEBECKj1ns+SkFOX3QPIu9ZPknMKmk9+ewNf/s4zOHfhMDxeTtBimGZCfeNG1ogZuj6yAzHT1nz7ZooNpwnDLR52h9ONaVZujOGYhs5uTOvJpIv4yV9/ip6BIL6nTOKFqY/gMew3PuwvIlNyyeRcnxAUTqellZywFrHw0RX8/P0oekb68N3fL+Lh0BAm3RFAyqsnuaH0i7BS35ZCigTN1c+n8Jf/5R38xX9+B3euzsI02cplmGZSFTPVE2QSM5Qzs1090FYh4zy7b3QeS9pY//cw26PVuTF97Ma0HAopXf/iAYoFA1+e8EK7chHhfBKl5WWsxt2y1Pqerw8PXGHZr6Xd5wU//sHH+N8/HMbcylHoAxE89ERhup78kJMb85FrSObI1EtSCJqLH93Df/8PP8YXH9yBUTTBMEzzoDQQOoGtrivmDs6R2p4jU2U3jkx1WrZR6UHiHEQoz/Cb0O9kv9CKBNxqbgy7Me3BNE3cvDSFE2fGoE7eRmluDkErD31+Dtdua3j5eA9een0Zv/7ZUWQyU3iqtAQNrXcrEi4dSy4vTCG8Pv7NDXzqdsvMwO9aBbjXWT8+wSDmXAFsx6SmJSlTSQh+96dXMHF6FJqHD0qGaQa0XzuTfokBHdhut5S2exVOtySzycmPWRkeSPehgYUU7pjP25flol2XThOv105Tpj8K93rYGaVy8zsjO4VSlAVny6HcmKW5JOam4xgfHkD5449RzuVlTsrTpUV8+JNLmMqcxRsvl/DmH7vweWgMcSEm2uHLUB5MHyUVKzSUTUFJiJiouH2wFKdX8liwi9yYa+qArFTaCcGwCKAZFtoQQWOYfcFGIoZOZrebb9/2Uw1qQT+Xt6+TECmItUNXbHeFLKadOjWULDSo89Tk3VC1/KrvQd6yp1U3Uts43Zhezq9sOaVyGdc+e4CRg73oTdxA+fYdsmjkv4WEcFieWcZf/sU1nPvGOZz1X0Q54sJsOoQ+KyulTCv3+T7kcL78EMWygkLlnO01awoHyqlHJd5VKDdm3r09N2YtTz9/CB6d1TXDNAMquW6EiCHaLmSoBX1Wc1QvlWmuSv0/T3kbJHxoI6QqKK0yOZtdmMYQVGvvDX2lC4XqGiFoks4Ge7xftIVCwcT9mw9x7qWjcF/+CaxiLbP7oTsMQzgaqdlVvPMXq3g/HEMmncfpcvs+XM9bMxgqpbDi8mGklMQQMk+ImJ3kxqyFQkrPv3YcHi+HlRimFdB+Qp/knawuHfEpHayEf+LG+g4MhZ+0yoVECouV1jFYyYtJOERHowRNNQxIIjTGQqYtJFeySCZyOCbe6PL/vY1ywX6jqe9LgEqahWNTqnzOKBG2R4RyyAGBrFtqfdyFQl4T5WXxvOzba/vP0PNOVnJpSuI57sSQ7R+J4Zt/ch7RWJB7yjBMkyAHhlJGqq4MpYtYJduZd3dbaKkKPXm60OwFEjPKHhYrVAlEbxq9NhJn9FrpOoXD/B04E4rEDAmNpUoeUpXdCJq1bgx3Sm0P1y9OY3xiCOrCHEoPH9p9w2ELhJOlJTztXsJnrkEY4jaJmO9ZN2W3Xlcbk0c2KqXOS29GxXvKGPIubccJgF/57jkcONwHpZGtxhmGeQza90Z8dmpJrpKORvP8KKVEJvxuY0/oON+0EzfyRlOsVFdZa5JpY57Off2eSr0/PfdVY32HhsJQFCqsR9A4k7LZjWkPpmnh6mf38do3zgAf/1wcjMXH/p3cj7fMOzigpGSIachKCjdkpeUVS7ZAsVc1mrzkTDQm96VUuU2hMCrDnnGFZEm5VMfbdFROP38Y51+fgO7jhC2mc6C9gk6As6a9BtOmL9Mp3Paa62/ABOl2QK9hrCJm6CSZXlfKtAtNqPNvvWKGA8BtoLTByWw3JCbTc6w6NGsFDR2IdNlK0Dir02IedmPaRTKeRT5nIBL1o3zpkggrFZ64DyXYvm5Nbvo4yiMpsTnVMFBVmDhFiVOQJCthoYzbY9/PEj8XCImV2g2jpxdlxVb7+YD4vli9y4EB8W8KDk0MYvbeEvK3FjDo07A0F4chQmXuSpn2VlCl0ld+/1nx9whwSInpGGidpcrctfsGiRsSNUnTFjT9up0n2o1HLk2SJ8efXis13sxYdmO8esUMC5k2sFHzv24ysquChsKB9CFbT9BQqCy8jtviDE+xG9M+VCEMXv360+gvrqA0Pwe39eQwJGcOykbOSFWEVAUIMV+yhxgQy2pIlko/esxQEGWhXkv+kBQYVjAsRQol1uqagoAQFLpXg6Zr4nsaBkJe6LoqvxcWIoPup2qqHFCpivvrHhWK+OrxqXLEghEOY+D0YSzenMLS1QeYn1ysS9A889JRHD05JEJK+8AWZroC5+a+GZRnMrPD9v6dQp/H/niuVkQbFf7UG8BmIdMGNnJkurEDMeX2bCRoKHxEF6egWevGcMJ2exk71I+rv3sHZsGPpNv3hBOypKwvQggSIlYoIkVIKKRD9WhCbNiCIxD2i4stQI57bUHiFeEaf9D7hABRNDc0j/iqitu7tOeOnBBC5GQAkUN9GDw5gumxXuT/9gOEhnowc2USxWxhXUFDbswb3zqHYMjXlRY9s/dYNuwCmKqICYh1NKDaDgWdC9N2QW1KVgx7T6m29z/o7951tVez80Zpn4ipHFrqaDZqwdzNIRanoKEziKSjAq0qaJw9aQh2Y9oH5cf89icXkc2ZiC8HEbrwNbjLJeRCvfAJsUGhlR4hPI72haH7bRHi0W0nRBWOhVe4H/6AV4oQSoql+zsFgCbu1+rwDOXFDBzpEW5RGKZY5r0hBarXg76jI3jqO+cxsfQMJj+4gbsfXJeChqiKmvNfPonhsSjcPJiN6QBIoCQc4SRaK7WK01I19OmrUnHG6SSyWOm9Ro5GbxeH7MOKfdkOLGTawNGAfcBVO+fSAUkH4V5wJ+g19HtqOTROQfOYiGE3pq1kE3lcvzKHc+cpufWEdFGqgkRx18SJ7rcFidzwUVscy8KF6bSFcnEugSufTcJ17gQUn/DYxbK/KsJKAydHERyIIDwSg0+EpgpLcbj9Pqzcn0dyJYWAEG4vvHJc/g0YphMgl6VaD0H5huRSbPRxo/2D1lNZvlxJCpa5h9g/sJBpE3ITd+3dzsNVQdNbETTOHkH0IevnopC2shrPCnfFjTNfOoT+wei23ZNO1KDT9xbx6RdzOHPqGHw+IJ/MI5/IYuipcTnWgMJZhVQWel8UJ7/5HIq5Am7//fvoESGwgdGIDHMxTCdAXdSrISVfnRVJtJfQz9EJMrUxCXVpJdNOYCHDNBW3q9YjiFwodmE6g8RyCl7dI5yWvbN5J5bT0AK6XL3pZeXiGXHbi9BAGC7FPmNYuDmDnkMDiI5EISJpuCfEy3OvTsjcmO5MkWT2GtXhxwStl/V2uyXBQw4/CSCzvPMuud0Id3xiWgaLmM6hWDARCOlQOjAnhAZZ0qW0zZ57hXxRJhsrGp2fuZAVYSOdkoh1VS7oRrYoXJocIiM9cKsK0kspaOLrgUN90HWNk3yZjsCZQ6m76xcjzs3cav1w+rbCjgzD7EPSqQK8wq1wK513LpMvFpHLF6AqCvxerxBbbrjcWz/PXFbEL3X90cKfF2Ekb18YikeTLk02mUVZrPC+WFC+bnJnBocj8Id0NmOYjoEKP6taRjaXrvPYNB3lyh34sW4q7MgwzD7EKhrwaO66XQhySAzDkNVO5fI2rZJtUi65UDDKiCfTmJlfxKr4av/ezX+uWDCgCgfGVclCNoXr5A0H5G3SQfl4Fp6gDj3sQ4nKVu8v4uCR/koXX1YyTGdgOSZCb2eDzjjyarzu/ZMfQ7AjwzDMhliWhWQqjVQmJwVMKBhANBxq6iLp9+vyQuIpmc4iIX5/VoiSgVgYmqbUlZhcqmwGqqdWBp5LpKWwoRLyYqaAUjyBkbGT4jHdHFZiOgZnVEjZRmipGor1VIYr76dDmoUMwzDrUigUsbi8KlZTDaGAXyYHe0Toxt2iumsKJ0XCQQT8PiwtL2NxNYneaEg20ltPzPhDPiSMEizh3qhCdJGIUTy1Jc4qmtBDXjm1O0uJwLIZn7qnEp6Z7qe8jY62VQpWTQB1a2ff3cChJYbZh/jEhm6YJRSL5rr/Tt9ficfh8Wjoj4UQCQXh83l33Xl3J1ADvr7eXuHQGEhn0ihtkMmoqa5NF3AKNWkej7ioMLIF2eTPy0m+TIchoqOPNmajtLWoofvSoMVqWIn6zuy3+XUsZBhmH+IRm7lZtIRL8eTpH4V0VpJCMLg0RCNheDSt7UnBJGYopEVJwJQMvF6eju71oJwvolQwamEl8R8Jn5JVticGU9O7yiLv0RXwcEim0/C5ao5Kztp6zpJT7Hj3YViJ4NASw+xDglE/cpm8EC1PrpK5vAGjWEBPNCzLkztlrw8IRyidsyuadBHiUteUjpPLVLifkAs/DcjWhLCRXYmFCKPRAyxZmE6ExEpKXPJmrfKo2kemuIUjQ6cXS0YtPyao7U93goUMw+xDQiEf8iK8ks8X5cbv3OSTuTx0EYIhJ6aTzu0oZyYowkHJVEo4LBbK7seTdHsGwjBzD2Aawmmi2V66RyYr031peVf1Wm4NuTWG2CXqqcCiXCFFKCO6sIHDNAoSH4tF8Xkzt3Zd1oMEC81YshyVSuF9GFYiOLTEMPsQX9ADU6yABXEaaG/0NhRWsoQbo3sonNR5G7dXODG6R4ftrzy++pM48xgFmMKxcbvK0PTHk4Ip8dcUYSdLbByq32OHqSgMtcUm8uO/+gRffHAPuWy+6aXnzP6ARMxc3p5Ft9khRWGijVLRlyqDIgkSLwPe+qdF7zXYkWGYfUgo4hPhGVWGlyyxqiplu+8EXaf/NFXryDM7mSsTCcshlmtFVqhHlyEkM0tipSzFSmEp9Uh8aMKhoYTfUsmCL+wXjoyFbCoPw7TEhqHKx6N+NYnVLFYWkyjkTCTjGVy/OIUDR/qlI8P9ZphGQEMhs46wUUSrVRvV25R3bVQ4ZVDu2/7qH1OFhQzD7ENUxY1AyIv4UhqFogmPbrf1l/+m6XLAYqdu2soGiceBgA+DQ1GkFlYQHu2Bx68j606LcJMhm975e0JYnVpEMZVDoC8C/4FBPLi/jMHRmHRurn0+iZuXprG0kIQqVBx9b3k5jYdTK0gnc5ifXsX5N06gtz/0qOkew2wXSs51OjF9uu2k0M3t+H1+8ZFNV8JSJGpoOC9Nvh7x7r8SbBYyDLMPoXyT8YkhrMwnkRIORDDghUuBLK/uiwTXdTw6HXJMYr1BLM2lZHm1fyAsXRhKaKbomS8aQHxmSfaZcbvLiI33Y+HOFN7+wcdYfhiXYufEmQN449vnEKMxBuJvcfmz+/jZP3wh/06/evsSZiYX8bU/eA5jh/pkYz2G2S5pR88XWSqNneFX7AuVXudMWwSRoJnN7z8xw59EhtmnUHLs5M2HSCdyKI2WxIKqSIGjurs3da5/JIqrUykU80UEXeIVCWepmvCr+jRoXh1Wzj6NJZFz9eY8esI+vPKN0zh8fAjBmBeaR3vULycc9WN4JCY3mxdenZBTtO0QE8PsjLyjpJrGCpD40BV7rtJOhAeJIbqsFG23hx5voQCM+fbPoF4WMgyzTxkYjohNvoSUCJtQpc9eqMoZEKLDX7gJM20n5lInXyNXlDsHhcs0n13JNHd1Fvfeu4GkCK29+uUTOHZ6BNFY4Im+MjQl/PjpUZTE7uD1e3D2/BFE+4IdOTWc6Q6cuS10ncRMppZvL6uPyGlRFTvRt96cmT6PXcVECcB0obBTRN0fOTMsZBhmn0JuA3W3pcTWrAjF6N7OKrdeC4muXLqIbKZWPRQIe+EXAsNdcUli/QH4/BrSSwnEikNQdQ0GNcmjkmwRCvKL0NPDKw/w8PKUcF/8GHv+GNLpAoriccuRgAyvOTn7pSNwi53g4LEB+AM6wjFfy0Y0MHuTAR2Im3ZIyFxHpeRL9kWOwYZduUTCxrOFsKHvx4SYWSrYJdkZ03Zq9oN/yEKGYfYpsvX/cAzLC0LIpAqIRoNPbOSdgpz7NJfA9YszWJqLi9CRIcNGJ88dxMmzo/AHvdJN8QixEu0PYypTgJEpwivEiltVpAiixY7CSUu35qAK0Tb2pRPIJbJYvnQLq/EMekciMrzmxFOZ1XRkYlB+dXVx2I3pDDRxCPV77AsJDmqIl7XskFNhnQZ4VYelKmxIRwcroSgSOc77O49OYwczm7oVFjIMs48ZOhDD5M05JFYyGBqNPXI2OgkSMR//+hY+/NV19A5GMDzWg0hPABkRPlLEal52LNckNMbGe3HngynkU1n4e4J2wm/FwVm++xDGUhy9pw8hJB4r0BPCF5/eQSKeE2EkQ1ZErTe2gAUM0wwoQhlU7UsVEjZVcUMCxlyjRigclVwzIi2g1PJsnPfbL7CQYZh9zMh4VDgbbsSFkKEuvwHV21Hzh6ivy7s/u44rH97F+ddP4JmXjiIQ3Pw5Hjo6iAf3ljBz9QGCAxGZFyNDS+L15RIZeEf7oFFp9koakZFeHDx/HHduTCEWC+DIqSHpVDFMu6BqI7r0VG5TAm+uZOfR5MwnhQ2xNs+G2C+JvgQLGYbZY1B33kyqKJwMA8GwDo+c8Lz+qhYK+mUC690b85h9sIojJwZlb5lrX0yJ28tYephAIKBj4uwBPPX8QUSigZYKnfnpOBamV3Do5AhOvzC+pYghAlEvYr0BzNxdRW41DY+vF24RhsosJ1FYScEXCSA61o+yWPipFNsnXJm5exoWRIhtXISQVF4VmQ6CQlFaZfwA9Er+SyUUtVE4itC5/JphmG5menIJ1y9OY3A0gtEDfUglszIMQ8m94bAfwSiVGasyZNIrXIvJG3NYnk/g4JE+EbIpCnfGRFg4FIeOD4nvx/HF+3dx9/pDvPTVUxg/Tpt980Mt5MbcvDojS1XPPD+OULg+EUXVVxSCck8mkVlKCdeFQmaqEDU55LIF9E8ckD1l8uJvYuaECyXCT+6AT+bgZDM5eDxBnorNdCwUjiJRE67s3hRCIjHjDEeRsAnto7lLLGQ6GLIQ6aCkpC3KbqeD1ap8rzoojCzIXo+d1c4wVFqcjueRXM3g3s1Z/OqHn+Pg4X70D8ege+wmdx4hZgJh36N8ExpXEIgFsSzcl1yugL7hEKLR43CJFdMb0FASDs/SwyR+95MreP8X16SIGROPqTRZzJAzlBbhn77BsCwV387vo1LqHqWEVCItxxV4NPG3KRSFWwXxmnTo4vUbBZrybUAP+eATt7PTCazMp6VgUveTL890NSRW1oaj9hssZNoEqWizcjGqgqVyoe9ZdSZqkQqfzgGDXrtnALN/oaTYuak4Ln54F5c/vo+FuVV4/Tpi/WGcevagHENQyBtic88ik8jh2uwD3LoyI0cVUA4JjSpYXcjIUuNA4HHRMHqwFy9+5Wm897MruPTJpHjMoBBA/qY6F0uLKeSLFsaF2FI92zu4wz1+hCNeLCfzMLJ5Id5UIVyK0L0qFLqo1FNGg2XYQzPDI72Ym1vB3GwcY0f6W+I4MQzTGHjraxFk+VHfgGopXb1CpV7m8zRrZn8leDGPs7qYwaX3buETEQYiN8MX1PHil0/ize+ckz1jqqKjOhhxfmYVM/eXZF8Ul1dDcTGJ+dlVjB7ue2Ijl9VAh3tx7KkR3Lg4hel7y5g47a3MZGo8lOdDYwGoiigqnrt7m1VDPvF6Yn0h3FtclCXWfhFKIvI5Q44soIfTvHYSsCHEnU+IMvrmqvi7UVdgj0fh8BLDdAksZFrAfAFIGNg2FAslYULWoVK50HVa0mmfMSvDxwxHu2t2ZfYv5EKceek4yoqChZkVhEW45OipEdnIzbkpU1UODT6ky8EjA3Jjp9yRz9+7jdXlNPLi+nobOYkKCilN3lmUAmj8+IB0Nnay35OYoh+TImodkWJaJXuYpRBKAeGsuLfZSZceM0jiTTznnAizlQ70ItQfFQ6MBZ0ShsXvlcMnxcOWxHOhUJMuwlG5eFyKvEDQ17E9dRiGeRze9poMTSPdSMRsJVS2gu5DmelGpaeAWW8va2ZP4hdhpOEDtFkfxJETw+gfiggRoG/qmgTD3spXXc5emhICJbGcQTDkEyLlSfHQNxQW9wthRYStVheF6+PTZS4Nsbbzrk88H3pcZ28aqoK6c31OCKYMNE0IIyGkjkwMyPlGa+npC4rn4ZUJyjthbZ5MhMTMUBRu8cERhg9cNLJA9whRZU/cGzx1AA9+l8ata3PoH4xA92lgGKbzYSHTZOLF2nXdbY9er1eo1IMzRMVhfUYXGzO5MNuFHIwjp4bxcCaOy59Non8kAp+qP3E/cnOe/9JRXL88LZ0Yu9FcTcjcuTGLt//fJ9LhIb75/fN49qWjMj+HKORNfPjrG1IEjY73yJ8ZPdgjJ0k7HSBN3D534YgMMe20GR0JrmNPDeOn79zAwFMH4e+PQPXWRBUJLI8QSlZcODbibEAXwkuPBbE4syzLssWzAMMwnQ8LmSZTcLgk0Z2dWG5K0fH4PhYyzC4IhHQMCgFz89K0ECJF6YSslycSivnw7MtHoAiB4VZqBx2183/q2YM4dHIAGaHgL314BzcvPsCpZw7Ypd5UXRH04PDEsBBbLrz57bPStdmM3XTU1YSyD4qQkcslwkupHIL9YWG8PPl6qFy7JOxM1e+BNxxA4p54/fmizDHiPBmG6Xx462syztB+o0M/piNpmH6Ph99NZhfQnCIKL5niwFqeTwm3ZP2MdBIXmqatO86AnJRIOIjhsShOPnMI2XReJgcbRTv+6REhJL8QCLmMXQq9U6jqj9yazaDn6fV6EFXLyFOezDr3p9egebVKArAihIwfhlFGcjmLUqMz8hmGaQq89TUZ5wyNtImG4lyWWcQwu4U2/kjUj5C4zD5Ykomxu3ms/pEwjp87iN/85DLu3ZyXAqlYNIS4KQi3xLXrtqNSzGyhNajcmvrkFFOZTYfPuGTejAUtoKEYDGBxKS3DXgzDdD4cWmoyMa2W7FuolF43SnQYjnWWhQzTCKjvzOBwBPPTK0J0mPB4tU2rkjbLYaHk4xdePIZsPIsf/K/f4MTpUZnNPnt3EV/+3nOPJkvX81hrcQk7h/Jz6LJZ+IcSe/0ivLSaKUhHZr20Z0r6dVXsUs3jkSG1jAhFlffT1D2G6WJ4+2syJDAijpzBbANdmccSfTmUzzQAn3AkeoeiSCXzyIjLVpZH2eXeNMRD+TRf//7z+L0/vYDlhRSW5uJ46RunceLM6LrVVNvRDlUhs9lTfBTKiqdhGhvfkQSPLAdXFVmGTdPArRI7MgzTDbAj0wLWujJ08tfoCiOuWGIaASW+hoSD4fV7sLKUkuXWqnvj8m0SMSQm3K71nRESOqp4zHPnD+OZC0c2/d1SxIjwTllx15VkW0Y1tlSrnFqLWyj8UNgrG+pRB195/zWP7cz1IUGj6hoyi0V2ZBoAdR4n/Vj9S9Iy5XZEFRXH9Wrrif0yH4hpHB0vZCgUQw3l6AOhiQO8T7eHYXUT5MpQrkw1R6bQICHjXGdZxzCNIjYQRDASwP3b8zh8YnDTPjS06ZhCzLg3OALlv4uvJZlM69qyeV6JRBG2RoagrJLMY1GUjX9CF6KEEpiLc5dQyglxEvZvmppDIsYbCWHh4l2ZoLyO7mHqhNbtpLl1HtN6kMMc89gNPlnYMFvR0fsfbdRTOVvEEKTs5/KPlxx3C1FHeCm38xzKx3B+wNkEZxoF9YoZHA5jfmoFRmHzWGjJ5ZYiZTPIsbErhrbe0UrbCOeUpSGz+f3pM+KVeT4uOSRyo6dArox0ZsT9aK5TyTTrfs7Mk6wa9kiW8g7/fDRvblEIobi5vXAjsz/paG+DWu6vVwFJ3XL7m9CTpZnQdGqyUa3KQMhGhJecpd3dKO6YzoQcjphwMQrCwaBBlOXyxsMh3RUhIRN1lY2dm9I2diO6a70TCbYUUUJoUcIydem1ioYMgZW3KJdShANVNErSHWJ2RrYiYrzVHMHKn9y55JUqt9cuXVQsRk4OFTOsFIGwyo4zszl8fLQQZym22YA1UnO8ezRzic9cmEZALkYk6pOhoExq634v1G9ms1JoEkHlOpvG0GO5yo1T5XL8RyWR1yrW57BQ2XmZnZhdYVbyYnwKicna90uOC7C+k0yRQgor0XtHx5VZZl+M2ZyOFjIBZf0zs24djKg22EGh3Jvq34dcnsUiGGbXUP6JR9NEiEVDOpmvL9zzKOl2feqNGJXKlnRR6qVUh+hRyZXRFDkcsl6TRRf3d3NyzI5pZC9BOhr4nWA2o6MlASnyAz47aYw2fhIC/fre6JmiNOiTSS5PtSKKvtIoGZ6AzewWt9jIQxEvkqtUhlzedKEg8QFsPiravk992I7MVo9n58dQsi8JLRIdzjBTSebl2LcN8e9F4bJQjozsO7PZ41oWTApBqSrUOqunmObCyb7MVnT8lkeihcTMXsA5d6lRQoaEC4m8agLxfF7YuX5ukMfsHppIbRibZ1tW3RMSDptJDxIc9VQAyfvB/pWy6Z2zTw2Jk4pAIRFjCtFhmKbsFkyhIKtSxfTosUr2hyJTzNfl3BCU8GsJweMRHyCXwh+i3UJ/wp0sdfQ2cjiJqRc+d28hzhEFjWxgF9ZsMVO1c6mya9wPhtkxXr+GYMiLpfkkVuNJeIt2dj31YyEx4nbVDP98ofgoEUIOkqycQle79LqkW2LZgsS9hdMi7idLtVGSDenKZetRdRKJEfq91RlQRcNAUVz3yAoj4RopKjS19via+I+cIFfAJZ/3VtBd8qk8Hnx0CxMHopuWnTMb08hcPXZjmHpgIdMiEg4RQ/1wdlOxRBVPlADndayzVN69XMmRIeeHfh+HmJjdoOiqLL8uOxJLZBiHmsuh9EjM0Egm5wxrCt64HOfTsvtuHb+vXHFbSABR5ZSyhSPiyrqEcDIQDAQeiaf1oFELW4WISMQk5+O4/Dcfok8v45WvnJSjCpjtw04K02p4q2sRcUcirr6DEz0SLyRQjFItRJUXG0i0staqa5ruLRVYyDC7R9M1hEIh2ea/GuohnJVFeRG6oblJNPm6JhhqwoHEiQwHbSEm5H1QfwM6mRhcR/ZuPRVTM5/fx50ffYSTp4bw+jfPom8gzPkxbYS7STDbgbe6FlAsPZ4fE3D81TOmnd+iuiqloo4qpGrp4UYVAGstXHrcnFXrVZO17P41DLMTLOHGeDS3dCuk4eFy1+TJo9wYeWNTQVEVElvpgvI2yq7p99Y7nZpCUfTsSJQ5xQm9LiNbxKQIJc389jJeen0Cz712HNFYgEXMLmhoaAkMszUsZFrAqlG77lsjLKoOynbLFXX3431pnI9ffcwcCxlmFxTzBSjSZdn4PuTMGNbmgxutOg9uStytF5dM9jWhqerWYw/E2UAxZ0D12UKGnk01lHTr55fgTafwh3/2Ig6dGILf72ER0wGUKr1jOEemfSTF/lG0bLff57YLSDr17WAh0wKcSb7eNcKChEc9IwvIqfFUDiZ1kxwbZzVUgf1ZZodQmCebNdA/7K/kwmxwv4pG2WzzN00DW/6+bTgsVSg3x1NHQq5d1WTPUXKJnZFKrKe/mML9967j0KAfz3/nGYwfG5DhMdYwu8ds4Aw4dmTaQ1p8thbzj59gk6ikLsuUj6l1mKhhIdNkSmtCQ2vLoqniiFyT6oe/el/FVZsGu53EYOcZTCObUjH7C9rQi5Tou4W2qB5vNJ9pMzFDE7BdjqWvvKZDHjk65LBQ1RNNnbY2+MWWVatiMosFYU16UCgY9iyl/OM5M/6QF4r4IKkVIVZI5ZGYT2D6/RswZhbw4rMHcfrZcfQOReBWWMF0Eg0aR9dyjEohhrNZ6V6B9rK4YV+oWW2f3jkuDQuZJuM8O9nowCahwm8E00mQMBifGMRv3r6McE8AA8PRdYUKCQsq0S4OGHIUwEb/7g/oSIcLjx6jsKYaiogvp6BJV2RF3tY8T4qjVDInhQ6xspRCwK/DUwkZLc6uwjJrAujCayfQPxpDKObD+OE+3PzFRZjiZ8cHA3jmW2dw5OQAAgEfh5I6GFozu+XdcU77JoE/KDb6oNKd09PpecNrh5ZoDyOHxvHRknMQM1l7jlavtvu5gbuF988m0+oYr+E42LgpHrNTyGE5d+EoCnkTH/ziOgrZwroJvcVN2v4Xxc/m8wYWZlbQMxARYqaWf+LxqhsKiPmZVfQNRhAKPykyQmGvDA+tx/B4L7yOpLBHfWzE1xe/+jROrKSlCOodCAlhFoGq8fLXbLbu0bw+ZpcNHqd8krRj2jdpbRI21Jy0W48yKWYqb94A7BQIauvhnGqeqEw5b7doc5XrqV9kdsXNdO36oBdNhcquqyEl+l1cgs3sBpp+TQ3vzHxpXcHiDWgbChJNU/CX/+mnMvfl+//ydUSoGgibIB5nZTGJ//Hv38Y//VdvYvRw75ML4yYr5Vp941rTBE/m4IgX4ebRA01nMlvL0ZPVmJWv1YsLta/V+1TfLfqxRGUIbozO+D2dn/TrdGOcjPnsPMi9dLTRyTLN9aOKW+fLbed7xdtcC6AKo+qHmkqxG+GUUA8ZdyUBuNogj84InDk2LGKY3aLrHnlBGNvm3Z9dxcz0Kv71v/02evpCdYmH5cW0DENF+wMN76yr8MiBltGr2+NSqm0k5PK3zVNmWt9CWneEZvZTihUl+o54bRdquVCLAlB1Lu1vQ97W/z14q2sBfvFXLlQa4qXFm92jb+/nSajI0feVxOGCOICMLRaF4SY7PwyzGaYIOX34qxv45h+9gFhvsG4HJB3PQhOrIDsm3Q2FGSisQqEI0zE3yVpT1FBy3C5XvpKAoXLfTkom3Qo6aSSHouBYl0OqfRK7V4/ksHiPA5WhzlV3hnJnpnK20GllagMLmRZAlttqRciQAKEuv9QDppogRR/0dGU2H32v5DiL2W7lESnhAZ37xzDtJZvII58t4sjJQZm0Wy+x/jCyOQOZdN7uJiwEDSUMF0WA3iUehtwaFjndAa1FPRr2BeRSUBhpxbAdClp/qVR5r/fBofeYRMuyYe9xtG+RKzObb62YYSHTAqjvS8xTEzMUZioU17+vsYO6w2qPGfrwUBa5yus802ZUnyqTcn/1jxfx2tdPo3c4AoUGOpZLT+SuOBk73CMFzK9+eBHnvnQMHl3F4twqrn32QDo7L715SlYicbk002nQIdm/T8dz9VZ6y1R7z7RazHCybwshCy6xdW+wJ9DdtXyYajM8svKqjfbI3RnhUBLTYczcX8Y//J93MTW5/Fifme//i9cwcXpUllqvx9LDBH7+d59j8u6CTNClkQExM4mZD6+j780X8dafvoz+oZAQM2w7MkwnkVzTSI/6zbQiZ4aFTIuh+UfUUKgqQugNdoaPIpUGeYpDuKwHKd772drtIwF2YpjOJLmcwcJ8Alf+8V3c+PQuvv5vvofTF47K2Uebka2UfPv9OmYvX8KNf/c/cTGh4/CffQdv/P6ziMSCHGZimA5jrZihXKdok8NsnMbfYkikkHsyEbQvRwOP/zvV41OSGN1vM2FCIsc5t2m5CIbpSMK9AUwLdybx6XWUi4YIHYkPgHtrN4UETCDglWIlrw3gYuwojiCOm+98jHvX5uzOw3waxjAdRbiS4lA9x6CWIPlSc9sCsZBpM1lHToy+zXej1xGPpZCVyYs604GQs/LZe7cQXZmF2+tDMOKHuk2vefxYP4ITx+DWNBydv4n3/uFTrCykwEqGYTqPPrE3+R0VW87+Zs2AhUybcZZRe7cZ8ifXxil+dpJ/wzDNZu7BKlxz02IlMxE8OAydHJlt2syUY/Pqt87i5tHnZY5Y9sZN3Lr0QHYOZi3DMJ0HVc9Wz1fIkUmatXL7RsNCps1kNpmMXQ89DlcmzkKG6UDmZ1bQm01i2deHo2fG4fXurCb35JkxPPd757F4/BxC0TA+/fV1rC6yK8MwnQhVMcUcnX6TRqUxYhNgIdNmCo7Qkm8H7wbl02iVA4Wsu2y3jo1l9iy5VB6FaC/mvSGMnxqB7tt5L5hXvn4K41/7EtLDBzA5Fcf8XAKmaYJhmM6DeqhV96di6fF5VI2EhUwboZwWZ2hpp/X2fZVOwRRm8vI7ynQYikfDrawHoTNPof9AjwgT7bx8QdNUvPm9c3jjm2eEQ3MAmVQOxaIFLr5kmM4krD3uyjTjXJsb4rWRosNn03chQMiVCQXBMB3J0IEYVOEzP/vKBPwBani0uzpMRVHwwmsTmHhqFG7xwfH5NC7DZpgOhTocy66/sHNl6ARecTV2dAP3kWkjzl4wVIHUu0+7QjJ7G5qgPSfCQIOjUZkfw6KDYfYXc/lKWAnN6SvDQqbNZCsDIHlSNcMwDLMXcTbJa0a3X94+2wwPd2QYhmH2Mj5HKKnQhOZ4nBrKMAzDMEzT0BxKg3JkGt1PhoUMwzAMwzBNRXO4MiRmGqllWMgwDMMwDNNUeGgkwzAMwzBdC40WqVoyci5gAy0ZFjIMwzAMwzSVUoPFixMWMgzDMAzDNBVngq9s7t3AUBMLGYZhGIZhuhbuI8MwDMMwTFOJeACjYM8DpJE8PKKAYRiGYRgGHFpiGIZhGKaLYSHDMAzDMEzXwkKGYRiGYZiuhYUMwzAMwzBdCwsZhmEYhmG6FhYyDMMwDMN0LSxkGIZhGIbpWljIMAzDMAzTtbCQYRiGYRima2EhwzAMwzBM18JChmEYhmGYroWFDMMwDMMwXQsLGYZhGIZhuhYWMgzDMAzDdC0sZBiGYRiG6Vr+Py4TdkfuxKWlAAAAAElFTkSuQmCC"
                alt="M12">
        </div>
        <div class="content">
            <h1>Welcome, {{firstName}}</h1>
            <p>We are glad to have you.</p>
            <p>Your account has been created successfully.</p>
            <div class="account-info">
                <p><strong>Username:</strong> {{uname}}</p>
                <p><strong>Password:</strong> {{password}}</p>
                <p><a href="{{activationLink}}" class="activate-button">Activate Account</a></p>
            </div>
            <p>M12-Planner is an easy to use tool to plan and forecast operations and various aspects of business at
                scale. You can collaborate, build scenarios, work with your third party data and more.</p>
            <p>You can activate your account by clicking on the "Activate my account" above.</p>
        </div>
        <div class="footer">
            <p>Feel free to share product feedback on <a href="mailto:ideas@m12-planner.ai">ideas@m12-planner.ai</a></p>
            <p>&copy; m12-planner.ai</p>
        </div>
    </div>
</body>

</html>
