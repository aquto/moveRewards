MoVE Rewards
===========

MoVE permite premiar el compromiso hacia tu marca en cada paso de la experiencia del cliente, incrementando el número de nuevos clientes al mismo tiempo que se aumenta el compromiso con clientes ya existentes.

# MoVE para Comercio (Flujo Multi-Page)

Premia a tus clientes con datos móviles en una amplia variedad de escenarios, tales como hacer compras, realizar reservas, subscribirse a notificaciones, y ayuda a aumentar la cantidad de items adicionales durante el proceso de compra mientras reduces el abandono de tus usuarios al mismo.

La integración con el flujo Multi-page de MoVE Reward Commerce debe realizarse en dos lugares, la página de inicio, donde la oferta es mostrada al abonado, y la página de agradecimiento, donde la confirmación del premio es mostrada al abonado. Durante este proceso Aquto utilizará una cookie de un servicio de terceros para registrar que el flujo ha comenzado. Esto sucede de forma automática a través de la API cuando la oferta inicial es mostrada al abonado. Cuando la conversión se concreta, la API lee esta cookie nuevamente y es utilizada para otorgar el premio y mostrar la página de confirmación al abonado.

![Move Rewards User Flow](./MoveRewardsUserFlow.png)

## Configuración

Esta librería debe ser añadida tanto en la página de inicio como la de agradecimiento. Puede ser embebida a través de un tag de script de la siguiente manera:

```html
<script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>
```

Si es embebida como un tag de script, esta expondrá un objeto global llamado `aquto`.

Se asume que se esta utilizando alguna librería de manipulación del DOM, como por ejemplo jQuery. Todos los ejemplos a continuación utilizaran la sintaxis de jQuery y deberán ser llamados en un bloque del tipo `$(document).ready()`.

## Chequeo de Elegiblidad

El método `checkEligibility` determina si el usuario actual es elegible o no para recibir los MB configurados de premio. Esta función inicia también una sesión para otorgar el premio en el servidor que puede ser completada más tarde. Debes llamar a `checkEligibility` en tu página de inicio.

### Parámetros de entrada
|Nombre|Tipo|Obligatorio|Descripción|
|---|:----:|:--------:|-----------|
|campaignId|string|sí|ID para la camapaña configurada por Aquto|
|callback|function|sí|Función que se llamará después de verificar la elegiblidad en el servidor|

### Propiedades de la respuesta
|Nombre|Tipo|Opcional| Descripción |
|---|:--:|:------:|-----------|
|eligible|boolean|no|Indica si el usuario actual es elegible o no para el premio|
|rewardAmount|integer| sí |Cantidad en MB del premio|
|rewardText|string| sí |Texto configurado en el servidor que debe contener el nombre del operador y la cantidad de datos de premio. Ejemplo: Abonando cualquier subscripción recibe 1GB extra para tu plan de datos de AT&T.|
|carrier|string| sí |Código que representa el operador del usuario|


```html
<div class="rewardBlock">
  <div class="rewardHeader"></div>
  <div class="rewardText"></div>
</div>
```

```javascript
aquto.checkEligibility({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
      $('.rewardBlock').show();
    }
  }
});
```

## Otorgar el Premio

El método `complete` finaliza la sesión creada previamente en el servidor y comienza el proceso de premiación de datos. Este método debe ser llamado en tu página de agradecimiento.

### Parámetros de entrada
|Nombre|Tipo|Obligatorio|Descripción|
|---|:----:|:--------:|-----------|
|campaignId|string|sí|ID para la camapaña configurada por Aquto|
|callback|function|sí|Función que se llamará después de otorgado el premio en el servidor|

### Propiedades de la respuesta
|Nombre|Tipo|Opcional|Descripción|
|---|:--:|:------:|-----------|
|eligible|boolean|no|Indica si el usuario sigue siendo elegible o no para el premio|
|rewardAmount|integer|sí|Cantidad en MB del premio|
|rewardText|string|sí|Texto configurado en el servidor que debe contener el nombre del operador y la cantidad de datos de premio. Ejemplo: ¡Felicitaciones, has ganado 1GB extra para tu plan de datos de AT&T!|
|carrier|string|sí|Código que representa el operador del usuario|

```html
<div class="rewardBlock">
  <div class="rewardHeader"></div>
  <div class="rewardText"></div>
</div>
```

```javascript
aquto.complete({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
      $('.rewardBlock').show();
    }
  }
});
```

# MoVE para Comercio (Flujo Single-Page)

El flujo single-page de MoVE Reward Commerce es ideal para flujos en donde la oferta es mostrada al cliente y estos son premiados por realizar una acción directamente en esa página, como por ejemplo mirar un video. Este flujo no utiliza cookies de terceros como el flujo Multi-page de MoVE Reward Commerce y devuelve en cambio un token cuando la oferta es mostrada al cliente. Este mismo token es provisto luego al SDK de Javascript cuando el usuario completa la oferta y se le muestra la confirmación del premio.

## Configuración

Esta librería debe ser añadida en la página donde será utilizada. Puede ser embebida a través de un tag de script de la siguiente manera:

```html
<script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>
```

Si es embebida como un tag de script, esta expondrá un objeto global llamado `aquto`.

## Chequeo de Elegiblidad

El método `checkEligibilitySinglePage` determina si el usuario actual es elegible o no para recibir los MB configurados de premio. Esta función inicia también una sesión para otorgar el premio en el servidor que puede ser completada más tarde.

### Parámetros de entrada
|Nombre|Tipo|Obligatorio|Descripción|
|---|:----:|:--------:|-----------|
|campaignId|string|sí|ID para la camapaña configurada por Aquto|
|callback|function|sí|Función que se llamará después de verificar la elegiblidad en el servidor|


### Propiedades de la respuesta
|Nombre|Tipo|Opcional| Descripción |
|---|:--:|:------:|-----------|
|eligible|boolean|no|Indica si el usuario actual es elegible o no para el premio|
|userToken|string|no| Token que debe ser enviado nuevamente al servidor cuando la acción de la oferta es completada|
|rewardAmount|integer| sí |Cantidad en MB del premio|
|rewardText|string| sí |Texto configurado en el servidor que debe contener el nombre del operador y la cantidad de datos de premio. Ejemplo: Abonando cualquier subscripción recibe 1GB extra para tu plan de datos de AT&T.|
|carrier|string| sí |Código que representa el operador del usuario|

```html
<div class="rewardBlock">
  <div class="rewardHeader"></div>
  <div class="rewardText"></div>
</div>
```

```javascript
var userToken

aquto.checkEligibilitySingePage({
  campaignId: '12345',
  callback: function(response) {
    userToken = response.useTokens
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
      $('.rewardBlock').show();
    }
  }
});
```

## Otorgar el Premio
El método `complete` finaliza la sesión creada previamente en el servidor y comienza el proceso de premiación de datos. Este método debe ser llamado desde el mismo contexto donde se encuentre el `userToken`.

### Parámetros de entrada
|Nombre|Tipo|Obligatorio|Descripción|
|---|:----:|:--------:|-----------|
|campaignId|string|sí|ID para la camapaña configurada por Aquto|
|callback|function|sí|Función que se llamará después de otorgado el premio en el servidor|
|userToken|string|yes|Cadena de caracteres que es devuelta como respuesta del chequeo de elegibilidad|

### Propiedades de la respuesta
|Nombre|Tipo|Opcional|Descripción|
|---|:--:|:------:|-----------|
|eligible|boolean|no|Indica si el usuario sigue siendo elegible o no para el premio|
|rewardAmount|integer|sí|Cantidad en MB del premio|
|rewardText|string|sí|Texto configurado en el servidor que debe contener el nombre del operador y la cantidad de datos de premio. Ejemplo: ¡Felicitaciones, has ganado 1GB extra para tu plan de datos de AT&T!|
|carrier|string|sí|Código que representa el operador del usuario|


```html
<div class="rewardBlock">
  <div class="rewardHeader"></div>
  <div class="rewardText"></div>
</div>

<button onClick='complete()' />Finish</button>
```

```javascript
var complete = function() {
  aquto.complete({
    campaignId: '12345',
    userToken: userToken,
    callback: function(response) {
      if (response && response.eligible) {
        $('.rewardText').text(response.rewardText);
        $('.rewardHeader').addClass('rewardHeader'+response.carrier);
        $('.rewardBlock').show();
      }
    }
  });
}
```

# MoVE para descargas orgánicas de aplicación

Con MoVE para Organic App Installs puedes premiar a los usuarios en tiempo real con datos por bajar tu aplicación. Esto eliminará la barrera de uso de datos que los usuarios encuentran al descargar tus aplicaciones.

## Configuración
Esta librería debe ser añadida en la página de descarga de la aplicación. Puede ser embebida a través de un tag de script de la siguiente manera:

```html
<script src="http://assets.aquto.com/moveRewards/aquto.min.js"></script>
```

Si es embebida como un tag de script, esta expondrá un objeto global llamado `aquto`.

Se asume que se esta utilizando alguna librería de manipulación del DOM, como por ejemplo jQuery. Todos los ejemplos a continuación utilizaran la sintaxis de jQuery y deberán ser llamados en un bloque del tipo `$(document).ready()`.

## Pre-Calificación

La llamada de chequeo de elegibilidad puede demorar algunos segundos debido a la comunicación con el operador. Para mejorar el rendimiento de esta llamada, puedes incluir el píxel 1x1 en algún paso anterior en en el flujo del usuario. Nosotros guardaremos en cache la información de elegibilidad del usuario por lo que todas las llamadas futuras para realizar el chequeo de elegiblidad deberían ser más rápidas.


```html
<img src="http://app.kickbit.com/api/campaign/datarewards/pixel" height="1" width="1" border="0">
```

## Chequeo de Elegibilidad
El método `checkAppEligibility ` determina si el usuario actual es elegible o no para recibir los MB configurados de premio. Esta función inicia también una sesión para otorgar el premio en el servidor que puede ser completada más tarde.

### Parámetros de entrada
|Nombre|Tipo|Obligatorio|Descripción|
|---|:----:|:--------:|-----------|
|campaignId|string|sí|ID para la camapaña configurada por Aquto|
|callback|function|sí|Función que se llamará después de verificar la elegiblidad en el servidor|


### Propiedades de la respuesta
|Nombre|Tipo|Opcional| Descripción |
|---|:--:|:------:|-----------|
|eligible|boolean|no|Indica si el usuario actual es elegible o no para el premio|
|rewardAmount|integer| sí |Cantidad en MB del premio|
|rewardText|string| sí |Texto configurado en el servidor que debe contener el nombre del operador y la cantidad de datos de premio. Ejemplo: Abonando cualquier subscripción recibe 1GB extra para tu plan de datos de AT&T.|
|carrier|string| sí |Código que representa el operador del usuario|
|clickUrl|string|true|Url que debe reemplazar la url de descarga de la aplicación|


```html
<div class="rewardBlock">
  <div class="rewardHeader"></div>
  <div class="rewardText"></div>
</div>

<a class="continue" href="#">Get App</a>
```

```javascript
aquto.checkAppEligibility({
  campaignId: '12345',
  callback: function(response) {
    if (response && response.eligible) {
      $('.rewardText').text(response.rewardText);
      $('.rewardHeader').addClass('rewardHeader'+response.carrier);
      $('.rewardBlock').show();
    }
    if (response && response.clickUrl) {
      $('.continue').attr('href', response.clickUrl);
    }
  }
});
```

## Completar

Para completar la conversión debes configurar un "callback" a través de alguno de nuestros socios de integración:
* Adjust
* Tune
* Appsflyer
* Kochava

Selecciona Aquto como editor y provee tus "click trackers" de iOS y Android a tu administrador de cuentas de Aquto.
