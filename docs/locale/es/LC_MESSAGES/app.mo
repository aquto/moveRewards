��    .      �              �     �  	                   8     A  8   M     �  w   �       ,   -     Z     ^     f     o     �     �     �     �  c   �  �   (     �  �   �  9    [   �                  �   @  F   �  �   1	     �	     �	  
   �	      
     
     
     
      
     )
     1
  
   >
     I
     P
     U
  �  Y
     �  	   �     �  .     	   3     =  L   J  *   �  v   �     9  ;   P     �     �     �  -   �     �     �     �       s   '  �   �     a  �   p  �  c  �        �     �  <   �  �   �  X   �  �   +            
        !     )     2     ;     >     G     O  
   \     g     n     r   Adjust Appsflyer Check Eligibility Code for user's carrier Complete Description Function called after checking eligibility on the server ID for campaign setup by Aquto In order to complete the conversion, you need to set up a server side callback through one of our integration partners: Input arguments Is the current user eligible for the reward? Key Kochava Optional Organic Downloads Pre-Qualification Required Response properties Reward amount in MB Select Aquto as publisher and provide iOS and Android click trackers to your Aquto account manager. Server configured string containing carrier and reward amount. Ex: Purchase any subscription and get 1GB added to your AT&T data plan. Setup The ``checkAppEligibility`` method determines if the current user if eligible to receive the configured MB reward . This function also starts a reward session on the server that can be completed later. The check eligibility call make take a few seconds due to communication with the carrier. To improve the performance of the eligibility call, you can include the following 1x1 pixel earlier in the user flow. We will cache the user's eligibility information and further calls to check eligibility should be faster. This library must be included on the app download page. It can be embedded as a script tag: Tune Type Url to replace app download link We assume you are using a DOM manipulation library, such as jQuery. All examples below will assume jQuery $ syntax and should be called in ``$(document).ready()`` block. When embedded as a script tag, it exposes the ``aquto`` global object. With MoVE for Organic App Installs you can reward users in real time with data for downloading your app. This removes the burden of cellular data usage for downloading your apps. boolean callback campaignId carrier clickUrl eligible false function integer rewardAmount rewardText string true yes Project-Id-Version: MoVE Rewards 1.1
Report-Msgid-Bugs-To: 
POT-Creation-Date: 2016-08-15 11:04-0400
PO-Revision-Date: YEAR-MO-DA HO:MI+ZONE
Last-Translator: FULL NAME <EMAIL@ADDRESS>
Language: es
Language-Team: es <LL@li.org>
Plural-Forms: nplurals=2; plural=(n != 1)
MIME-Version: 1.0
Content-Type: text/plain; charset=utf-8
Content-Transfer-Encoding: 8bit
Generated-By: Babel 2.3.4
 Adjust Appsflyer Chequeo de Elegibilidad Código que representa el operador del usuario Completar Descripción Función que se llamará después de verificar la elegiblidad en el servidor ID para la camapaña configurada por Aquto Para completar la conversión debes configurar un ``callback`` a través de alguno de nuestros socios de integración: Parámetros de entrada Indica si el usuario actual es elegible o no para el premio Nombre Kochava Opcional MoVE para descargas orgánicas de aplicación Pre-Calificación Obligatorion Propiedades de la respuesta Cantidad en MB del premio Selecciona Aquto como editor y provee tus "click trackers" de iOS y Android a tu administrador de cuentas de Aquto. Texto configurado en el servidor que debe contener el nombre del operador y la cantidad de datos de premio. Ejemplo: Abonando cualquier subscripción recibe 1GB extra para tu plan de datos de AT&T. Configuración El método `checkAppEligibility ` determina si el usuario actual es elegible o no para recibir los MB configurados de premio. Esta función inicia también una sesión para otorgar el premio en el servidor que puede ser completada más tarde. La llamada de chequeo de elegibilidad puede demorar algunos segundos debido a la comunicación con el operador. Para mejorar el rendimiento de esta llamada, puedes incluir el píxel 1x1 en algún paso anterior en en el flujo del usuario. Nosotros guardaremos en cache la información de elegibilidad del usuario por lo que todas las llamadas futuras para realizar el chequeo de elegiblidad deberían ser más rápidas. Esta librería debe ser añadida en la página de descarga de la aplicación.Puede ser embebida a través de un tag de script de la siguiente manera: Tune Tipo Url que debe reemplazar la url de descarga de la aplicación Se asume que se esta utilizando alguna librería de manipulación del DOM, como por ejemplo jQuery. Todos los ejemplos a continuación utilizaran la sintaxis de jQuery y deberán ser llamados en un bloque del tipo ``$(document).ready()``. Si es embebida como un tag de script, esta expondrá un objeto global llamado ``aquto``. Con MoVE para Organic App Installs puedes premiar a los usuarios en tiempo real con datos por bajar tu aplicación. Esto eliminará la barrera de uso de datos que los usuarios encuentran al descargar tus aplicaciones. boolean callback campaignId carrier clickUrl eligible no function integer rewardAmount rewardText string sí sí 