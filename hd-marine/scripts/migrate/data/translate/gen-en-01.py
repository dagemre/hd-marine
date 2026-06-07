# -*- coding: utf-8 -*-
"""Generate EN translation SQL for HD Marine products (batch 01)."""
import json, re, uuid, os, unicodedata

BASE = os.path.dirname(os.path.abspath(__file__))
INPUT = os.path.join(BASE, "input-01.json")
SQL_DIR = os.path.normpath(os.path.join(BASE, "..", "sql", "en"))
NS = uuid.UUID("8f0c2c1e-5b7a-4b54-9a4e-1d2000000000")

T = {
628: dict(
 en_name="Diaphragm Pump",
 en_summary="Diaphragm Pump – Flexibility and Reliability in Industrial Liquid Transfer",
 en_description_html="<div> <p><strong>Diaphragm pumps</strong> are positive displacement pumps that transfer liquid without mechanical contact by means of an elastic diaphragm, delivering high efficiency and durability in industrial processes. They stand out for maintaining performance even with fluids containing dust, dirt and particles.</p><p>These pumps offer the ideal solution for the safe and controlled handling of <strong>high-viscosity, abrasive or contaminated liquids</strong>. They are designed to maximize liquid transfer line safety in marine and industrial environments.</p> </div><div> <p><strong>HD Marine diaphragm pumps</strong>;</p><ul><li>Provide highly efficient positive displacement for a <strong>more stable flow</strong></li><li>Deliver <strong>long-lasting performance</strong> when handling abrasive and contaminated liquids</li><li>Build confidence on your production line with a <strong>robust and durable construction</strong> suited to marine and industrial environments</li></ul> </div>",
 en_usage_areas_html="<div> <p>Diaphragm pumps are used particularly in:</p><ul><li>Chemical and petrochemical plants</li><li>Food and pharmaceutical production lines</li><li>Wastewater and filtration facilities</li><li>Paint, printing and solvent transfer applications</li><li>Marine machinery</li></ul><p>delivering reliable performance across a wide variety of industrial and marine applications.</p> </div>",
 faqs=[
  ("How does a diaphragm pump work?", "<div> <p>Liquid is drawn in and discharged by the back-and-forth movement of a flexible diaphragm; there is no mechanical friction with the fluid.</p> </div>"),
  ("For which liquids is it preferred?", "<div> <p>It is effective with particle-laden, abrasive, chemical or soluble liquids.</p> </div>"),
  ("What is the difference between a diaphragm pump and a centrifugal pump?", "<div> <p>Diaphragm pumps move liquid in a fixed volume via positive displacement, while centrifugal pumps convey the fluid using centrifugal force.</p> </div>"),
  ("In which industries is it used in Turkey?", "<div> <ul><li>It is common in chemical, paint and solvent, food and pharmaceutical, wastewater, marine and industrial facilities.</li></ul> </div>"),
 ]),
693: dict(
 en_name="Gear Pump",
 en_summary="Gear Pump – Industrial Liquid Transfer Solutions",
 en_description_html="<div> <p><strong>Gear pumps</strong> are mechanical pumps that, thanks to their positive displacement operation, deliver a fixed amount of liquid per revolution and are frequently preferred in industrial systems. With these characteristics, they offer high performance and reliability, especially in the transfer of viscous (thick) liquids.</p><p>Gear pumps are the ideal solution for <strong>high-pressure transfer</strong>, <strong>low flow rate applications</strong> and <strong>systems requiring continuous flow control</strong>. By means of the gear wheels inside, these pumps draw in the liquid, pressurize it and deliver it steadily into the system line.</p><p>HD Marine gear pumps provide effectiveness in a variety of applications, from industrial facilities to production lines, with the capacity to transfer liquids across a wide viscosity range without problems.</p> </div><div> <p>✔ <strong>Constant flow rate:</strong> Delivers the same volume of liquid per revolution. <br/>✔ <strong>High viscosity compatibility:</strong> Suitable for oils, resins, chemicals and thick liquids. <br/>✔ <strong>High efficiency at low speed:</strong> Achieves the desired pressure and flow rate even at low motor speeds. <br/>✔ <strong>Reliable performance:</strong> Offers continuous and stable operation in industrial processes.</p> </div>",
 en_usage_areas_html="<div> <p>Gear pumps are used effectively in production facilities, chemical and petrochemical lines, lubrication systems, panel and hydraulic circuits, and in all industrial applications requiring viscous liquid transfer.</p> </div>",
 faqs=[
  ("What is a gear pump used for?", "<div> <p>Gear pumps draw in and discharge liquid at a fixed volume by means of gears, providing a smooth transfer.</p> </div>"),
  ("With which liquids is it used?", "<div> <p>It is effective with oils, resins, chemical liquids and high-viscosity fluids.</p> </div>"),
  ("What is the difference between a gear pump and a centrifugal pump?", "<div> <p>Gear pumps provide fixed-displacement flow; centrifugal pumps generate flow through pressure differential.</p> </div>"),
 ]),
698: dict(
 en_name="Blower",
 en_summary="Industrial Blower – Powerful Air & Gas Transfer Solutions",
 en_description_html="<div> <p>A <strong>blower</strong> is an industrial air <strong>blowing and vacuum device</strong> that draws in air or gas at high flow rates and within a specific pressure range and delivers it to the outlet. It plays an active role in applications such as oxygenation of industrial processes, ventilation, drying, supplying compressed air or gas evacuation. Blowers generate higher pressure and a more controllable flow rate than fans, which is why they are preferred in many fields such as HVAC, treatment plants, pneumatic conveying and process equipment.</p> </div><div> <p><strong>✔️ Why HD Marine Blowers?</strong></p><p>HD Marine blowers:</p><ul><li>Deliver <strong>energy-efficient performance</strong></li><li>Are durable with <strong>low vibration and long service life</strong></li><li>Offer suitable options for different <strong>flow rates and pressure levels</strong></li><li>Reduce operating costs with <strong>easy installation and maintenance</strong></li></ul><p>These characteristics make blowers a reliable solution within industrial air handling and process equipment.</p> </div><div> <p>✔ <strong>High air / gas flow rate:</strong> Provides large-volume airflow <br/>✔ <strong>Pressure boosting capacity:</strong> Generates higher pressure than fans <br/>✔ <strong>Air transfer and vacuum applications:</strong> Can be used in both blowing and suction directions <br/>✔ <strong>Motor-controlled air intake:</strong> Stable performance thanks to the electric motor<br/>✔ <strong>Various types:</strong> Compatible with centrifugal, rotary or positive displacement models <br/>✔ <strong>Durable housing:</strong> Suited to industrial operating conditions</p> </div>",
 en_usage_areas_html=None,
 faqs=[
  ("What is a blower?", "<div> <p>A blower is an industrial air/gas transfer device that draws in air or gas at high flow rates and specific pressure values and delivers it to the outlet.</p> </div>"),
  ("What is the difference between a blower and a fan?", "<div> <p>Fans generally provide low-pressure air circulation, while blowers are performance-oriented with higher pressure and a controllable flow rate.</p> </div>"),
  ("In which applications is it used?", "<div> <p>It is used in ventilation, pneumatic conveying, drying, wastewater treatment and marine air evacuation processes.</p> </div>"),
  ("What should be considered when selecting a blower?", "<div> <p>The required airflow, desired pressure level, ambient temperature and motor power are important criteria in blower selection.</p> </div>"),
 ]),
736: dict(
 en_name="Magnetic Drive Acid Pumps",
 en_summary="Magnetic Drive Acid Pump – Reliable Transfer for Corrosive Liquids",
 en_description_html="<div> <p>Magnetic drive acid pumps are <strong>magnetically coupled positive displacement pumps specially built for handling acids, chemicals and corrosive liquids</strong>. By using a magnetic coupling instead of a mechanical seal, they maximize sealing performance and <strong>offer superior resistance to contaminants and abrasive fluids</strong>.</p><p>HD Marine magnetic drive acid pumps deliver <strong>high performance and durability</strong> across a wide range of uses, particularly <strong>from laboratories to production lines</strong>, from chemical plants to marine applications.</p> </div><div> <ul><li><p>✔ <strong>High chemical resistance:</strong> Operates with harsh liquids over long periods<br/>✔ <strong>Leak-free performance:</strong> Safe transfer thanks to the magnetic coupling<br/>✔ <strong>Easy installation:</strong> User-friendly mounting design<br/>✔ <strong>Long-life construction:</strong> High durability with minimal maintenance</p></li></ul> </div>",
 en_usage_areas_html="<div> <p>HD Marine magnetic drive acid pumps are an effective solution particularly in:</p><ul><li>Chemical production plants</li><li>Paint and solvent lines</li><li>Water and wastewater treatment</li><li>Acid/alkali transfer systems</li><li>Marine and industrial processes</li></ul><p>and in all applications <strong>requiring the safe handling of corrosive and abrasive fluids</strong>.</p> </div>",
 faqs=[
  ("What is a magnetic drive acid pump?", "<div> <p>It is a magnetically coupled positive displacement pump that provides leak-free transfer by using a magnetic drive instead of a mechanical seal.</p> </div>"),
  ("Is it suitable for chemical liquids?", "<div> <p>Yes, it has been developed for the transfer of acids, alkalis and chemical reaction liquids.</p> </div>"),
  ("Why is no packing used?", "<div> <p>Thanks to the magnetic coupling, the need for packing is reduced, providing sealing and maintenance advantages.</p> </div>"),
  ("Where should it be used?", "<div> <p>It is preferred in chemical plants, water treatment, paint lines and industrial processes.</p> </div>"),
 ]),
747: dict(
 en_name="Drum Pump",
 en_summary="Drum Pump – A Practical Solution for Industrial Liquid Transfer",
 en_description_html="<div> <p><strong>Drum pumps</strong> are industrial equipment that enable the fast, controlled and ergonomic transfer of liquids from drums, jerry cans and cylindrical storage tanks. They deliver ideal performance in the handling of oils, chemicals, solvents, fuels and other fluids.</p><p>HD Marine drum pumps, with their durable construction, easy installation and broad application compatibility, are a reliable liquid transfer solution in both industrial facilities and marine processes.</p> </div><div> <p>✔ <strong>Practical installation:</strong> Suitable for various drum diameters<br/>✔ <strong>Durable construction:</strong> Materials with high chemical and solvent resistance<br/>✔ <strong>Various drive options:</strong> Manual, electric or pneumatic operation<br/>✔ <strong>Easy to use:</strong> Fast transfer with an ergonomic pump design<br/>✔ <strong>Broad application compatibility:</strong> Transfer of oil, fuel, chemicals, acids and alkalis</p> </div>",
 en_usage_areas_html=None,
 faqs=[
  ("What is a drum pump?", "<div> <p>A drum pump is a special transfer pump that can dispense liquids from drums, jerry cans and tanks in an ergonomic and controlled manner.</p> </div>"),
  ("With which liquids can it be used?", "<div> <p>Suitable models are available for oils, chemicals, solvents, fuels and various fluid types.</p> </div>"),
  ("What is the advantage of an electric drum pump?", "<div> <p>Electric models provide faster transfer with less effort; they are suitable for large-volume storage.</p> </div>"),
  ("How is the pump material selected?", "<div> <p>The body and gasket materials (PP, aluminum, stainless steel, Viton, etc.) should be selected according to the chemical nature of the liquid to be handled.</p> </div>"),
 ]),
752: dict(
 en_name="Vacuum Pump",
 en_summary="Vacuum Pump – A Powerful Solution for Effective Air/Void Control",
 en_description_html="<div> <p><strong>Vacuum pumps</strong> create negative pressure in a system by extracting the air or gas molecules within it. In this way, they deliver reliable performance in critical industrial applications such as <strong>creating a vacuum environment, gas evacuation and discharging ambient air</strong>. They are widely used in industry, chemicals, laboratories, production lines, packaging and process control systems.</p><p>HD Marine vacuum pumps, with their durable construction, precise suction power and high efficiency, <strong>deliver effective results even under continuous operating conditions.</strong></p> </div><div> <p>✔ <strong>High suction capacity:</strong> Stable and fast evacuation<br/>✔ <strong>Energy saving:</strong> Low energy consumption in long-term use<br/>✔ <strong>Broad compatibility:</strong> Integrates with different industry types<br/>✔ <strong>User-friendly design:</strong> Easy installation and maintenance</p> </div>",
 en_usage_areas_html="<div> <p>HD Marine vacuum pumps are suitable particularly for:</p><ul><li>Industrial process lines</li><li>Laboratory applications</li><li>Packaging machines</li><li>Chemical plants</li><li>HVAC and drying systems</li><li>Electronics production lines</li></ul><p>and other <strong>processes requiring gas evacuation or a vacuum environment</strong>.</p> </div>",
 faqs=[
  ("What is a vacuum pump?", "<div> <p>A vacuum pump creates negative pressure by extracting air or gases from a system, providing a vacuum environment.</p> </div>"),
  ("In which industries is it used?", "<div> <p>It is widely used in industry, laboratories, production lines, packaging and chemical plants.</p> </div>"),
  ("What is the difference between a vacuum pump and a pressure pump?", "<div> <p>A vacuum pump draws air by creating negative pressure, whereas a pressure pump pushes the fluid.</p> </div>"),
  ("How often should a vacuum pump be maintained?", "<div> <p>Periodic oil changes and leak checks are recommended depending on operating conditions.</p> </div>"),
 ]),
757: dict(
 en_name="Dosing Pump",
 en_summary="Dosing Pump – A Precise and Reliable Liquid Dosing Solution",
 en_description_html="<div> <p><strong>Dosing pumps</strong> are high-precision industrial pumps designed to add a specific fluid to a system <strong>at a defined ratio and flow rate</strong>. They are frequently used in water treatment, chemicals, food production, wastewater processing and process control applications. Thanks to accurate dosing capability, they <strong>raise the quality of the manufactured product, reduce costs and increase process efficiency.</strong></p><p>HD Marine dosing pumps, with their <strong>adjustable flow control and durable construction</strong>, deliver stable and repeatable performance in industrial systems of every scale.</p> </div><div> <p>✔ <strong>High precision:</strong> Top-level consistency in the measured liquid quantity<br/>✔ <strong>Energy efficiency:</strong> Low energy consumption in long-term use<br/>✔ <strong>Easy maintenance:</strong> Fast servicing thanks to its modular design<br/>✔ <strong>Broad application compatibility:</strong> Flexible use for many industrial processes</p> </div>",
 en_usage_areas_html="<div> <p>HD Marine dosing pumps are used reliably in the following sectors:</p><ul><li><strong>Water and wastewater treatment plants</strong></li><li><strong>Chemical and petrochemical industry</strong></li><li><strong>Food and beverage production</strong></li><li><strong>Dyeing and textile processes</strong></li><li><strong>Heating, cooling and HVAC systems</strong></li><li><strong>Industrial process automation</strong></li></ul><p>These pumps deliver high accuracy in all applications requiring controlled and continuous dosing.</p> </div>",
 faqs=[
  ("How does a diaphragm pump work?", "<div> <p>A dosing pump is used to add a specific volume of liquid to a system in a controlled and adjustable manner.</p> </div>"),
  ("In which sectors is it preferred?", "<div> <p>It is widely used in water treatment, chemical production, food and beverage lines, wastewater and process control applications.</p> </div>"),
  ("What is the difference between a dosing pump and a diaphragm pump?", "<div> <p>A dosing pump is optimized for precise and adjustable liquid addition, while a diaphragm pump provides general positive displacement transfer.</p> </div>"),
  ("How is the flow rate adjusted?", "<div> <p>The desired flow rate can easily be selected via the control panel and adjustment knobs.</p> </div>"),
 ]),
766: dict(
 en_name="Mono Pump",
 en_summary="Mono Pump – Industrial Single-Stage Liquid Pump Solution",
 en_description_html="<div> <p>A <strong>mono pump</strong> is a type of <strong>single-stage centrifugal pump</strong> generally used in industrial facilities. It stands out with highly efficient liquid transfer, a simple design and low maintenance requirements. Mono pump models deliver reliable performance particularly in the handling of <strong>water, chemical solutions, oil and other fluids</strong>.</p><p>HD Marine mono pumps are a powerful aid in industrial processes thanks to their compact design, durable construction and <strong>high operating efficiency</strong>.</p> </div><div> <p>HD Marine mono pumps offer effective solutions in the following areas:</p><ul><li><strong>Water supply and discharge systems</strong></li><li><strong>Chemical transfer applications</strong></li><li><strong>Cooling systems</strong></li><li><strong>Paint and textile processes</strong></li><li><strong>Machine and equipment circuits</strong></li></ul><p>In these applications, the mono pump provides efficient and continuous liquid flow, contributing to the uninterrupted operation of processes.</p> </div><div> <p>📌 <strong>High efficiency:</strong> Effective energy use with a single-stage design</p><p>🛠 <strong>Easy maintenance:</strong> Servicing is simple and fast</p><p>🔧 <strong>Durability:</strong> Long-life construction with low operating costs</p><p>⚙ <strong>Various flow rate options:</strong> Wide capacity range from small to medium scale</p> </div>",
 en_usage_areas_html=None,
 faqs=[
  ("What is a mono pump?", "<div> <p>A mono pump is a liquid transfer pump operating on a single-stage centrifugal principle.</p> </div>"),
  ("With which liquids is it used?", "<div> <p>It is ideal for the transfer of fluids such as water, light chemical solutions, cooling and process water.</p> </div>"),
  ("What is the advantage of a mono pump?", "<div> <p>Thanks to its simple design, it provides low maintenance requirements, high efficiency and durability.</p> </div>"),
  ("Who should choose it?", "<div> <p>It is suitable for factories, industrial facilities, water transfer systems and process applications.</p> </div>"),
 ]),
769: dict(
 en_name="Spiral Wound Steel Gasket",
 en_summary="Spiral Wound Steel Gasket – Heavy-Duty Sealing Solution",
 en_description_html="<div> <p><strong>Spiral wound steel gaskets</strong> are industrial sealing elements that deliver <strong>superior sealing performance</strong> in high-pressure, high-temperature and demanding operating environments. The steel spiral winding structure, containing elastomer or graphite filler material, offers <strong>high strength, flexibility and recompression capability</strong>.</p><p>HD Marine spiral wound steel gaskets deliver long-lasting and reliable performance at <strong>flange connections</strong>, <strong>pipelines</strong>, <strong>pressure vessels</strong>, <strong>valves</strong> and other critical sealing points.</p> </div><div> <p>✔ <strong>High pressure resistance:</strong> Effective in heavy-duty applications<br/>✔ <strong>High temperature tolerance:</strong> Performance up to ±540°C<br/>✔ <strong>Mechanical strength:</strong> Superior resistance with a steel-wound structure<br/>✔ <strong>Flexible adaptation:</strong> Tolerates flange surface irregularities<br/>✔ <strong>Wide range of applications:</strong> Oil, chemical, energy and shipboard facilities</p> </div>",
 en_usage_areas_html="<div> <p>Spiral wound steel gaskets are used particularly in:</p><ul><li><strong>High-pressure pipelines</strong></li><li><strong>Steam and heat systems</strong></li><li><strong>Critical flange connections</strong></li><li><strong>Valve and pump bodies</strong></li><li><strong>Oil, chemical and energy plants</strong></li><li><strong>Ship and marine applications</strong></li></ul><p>and other industrial environments <strong>requiring high strength and sealing performance</strong>.</p> </div>",
 faqs=[
  ("What is a spiral wound steel gasket?", "<div> <p>A spiral wound steel gasket is an industrial gasket that provides sealing at high pressure through a steel wire spiral structure and elastomer / graphite filler.</p> </div>"),
  ("In which applications is it used?", "<div> <p>It is preferred in flange connections, pipelines, valves, pressurized systems and high-temperature applications.</p> </div>"),
  ("What does the graphite filler do?", "<div> <p>The graphite filler provides high temperature and chemical resistance, and increases the gasket's flexible adaptation.</p> </div>"),
  ("Why is the steel material type important?", "<div> <p>Stainless steels such as AISI 304 and AISI 316 provide long life and resistance in corrosive environments.</p> </div>"),
 ]),
774: dict(
 en_name="Graphite and Klingerite Gaskets",
 en_summary="Graphite & Klingerite Gaskets – High-Performance Sealing Elements",
 en_description_html="<div> <p><strong>Graphite and klingerite gaskets</strong> are critical sealing solutions used in pipelines, flange connections, valves and industrial equipment to provide <strong>sealing against high temperature, high pressure and aggressive chemicals</strong>. These gaskets are manufactured from special graphite alloy materials and fiber-reinforced compositions, and deliver reliable performance in demanding processes.</p><p>Graphite gaskets are produced from pure or reinforced graphite material and are preferred particularly in high-heat, steam, oil, water and gas applications. This structure gives the material both <strong>high chemical resistance</strong> and <strong>temperature tolerance</strong>.</p><p>Klingerite gaskets are typically formed by pressing graphite- or fiber-based mixtures, and provide sealing to industrial standards with asbestos-free options.</p> </div><div> <p>✔ <strong>High temperature resistance</strong> – Suitable for steam and superheated environments (performance over a wide temperature range) <br/>✔ <strong>Strong sealing against pressure</strong> – Creates an effective seal at flange, valve and pipe joint connections <br/>✔ <strong>Chemical resistance</strong> – Resistant to oils, acids, alkaline solutions and solvents <br/>✔ <strong>Flexible conformity</strong> – Fills surface irregularities for effective gasket performance <br/>✔ <strong>Asbestos-free production</strong> – Manufactured with alternatives that meet modern sealing requirements and are harmless to human health</p> </div>",
 en_usage_areas_html="<div> <p>Graphite and klingerite gaskets are used effectively in the following applications:</p><ul><li>Flange connections and pipelines</li><li>Valve covers and pump bodies</li><li>Steam systems and high-temperature processes</li><li>Chemical, petrochemical and energy plants</li><li>Marine and industrial piping circuits</li></ul><p>These gaskets are sealing elements preferred particularly for <strong>high temperature, high pressure and aggressive environments</strong>.</p> </div>",
 faqs=[
  ("What is a graphite gasket?", "<div> <p>A graphite gasket is a graphite-based gasket type that provides effective sealing at high temperature and pressure; it is resistant to aggressive chemicals.</p> </div>"),
  ("What is a klingerite gasket used for?", "<div> <p>Klingerite gaskets are formed from a mixture of graphite and fiber, and provide reliable sealing at flange, valve and pipe connections.</p> </div>"),
  ("In which sectors is it used?", "<div> <p>It is widely used in chemicals, energy, petrochemicals, shipping, steam lines and general industrial processes.</p> </div>"),
  ("What is the difference between a graphite gasket and a standard gasket?", "<div> <p>Graphite gaskets provide high temperature and chemical resistance; standard gaskets are for lower-performance environments.</p> </div>"),
 ]),
779: dict(
 en_name="Teflon and Self-Adhesive Teflon Gasket",
 en_summary="Teflon & Self-Adhesive Teflon Gaskets – High-Performance Sealing Elements",
 en_description_html="<div> <p><strong>Teflon gaskets (PTFE gaskets)</strong> and <strong>self-adhesive Teflon gaskets</strong> are high-performance sealing elements used to provide <strong>high chemical resistance, low friction and excellent sealing</strong> at industrial pipelines, valve connections, pump bodies and various mechanical assembly points.</p><p>Since PTFE material is resistant to chemicals, high temperatures and abrasive environments, these gaskets are preferred particularly in <strong>applications involving aggressive fluids</strong>. Self-adhesive Teflon gaskets additionally offer <strong>easy positioning</strong> during application and a <strong>fast installation advantage</strong>.</p> </div><div> <p>✔ <strong>High chemical resistance:</strong> Resistant to acids, alkalis and aggressive fluids<br/>✔ <strong>Wide temperature tolerance:</strong> Safe use from -200°C up to +260°C<br/>✔ <strong>Low friction:</strong> Minimized during installation and use<br/>✔ <strong>Easy installation (self-adhesive):</strong> Practical application with a self-adhesive surface<br/>✔ <strong>Long service life:</strong> High-performance and durable PTFE material</p> </div>",
 en_usage_areas_html="<div> <p>HD Marine Teflon and Self-Adhesive Teflon gaskets provide effective sealing in the following applications:</p><ul><li>Industrial pipe and flange connections</li><li>Chemical and petrochemical plants</li><li>Abrasive chemical transfer lines</li><li>Shipboard marine systems</li><li>Processes requiring high temperature/chemical resistance</li></ul><p>These gaskets provide reliable and long-lasting sealing, particularly in <strong>circuits where chemicals are conveyed</strong>.</p> </div>",
 faqs=[
  ("What is a Teflon gasket?", "<div> <p>A Teflon gasket is a sealing element made from PTFE material, providing high chemical resistance and low friction.</p> </div>"),
  ("What is a self-adhesive Teflon gasket used for?", "<div> <p>The self-adhesive Teflon gasket is designed for easy positioning on slippery surfaces during installation and fast setup.</p> </div>"),
  ("In which applications is it preferred?", "<div> <p>It is preferred in chemical plants, pipe flanges, valve connections, pump bodies and aggressive fluid circuits.</p> </div>"),
  ("What is the temperature resistance of a Teflon gasket?", "<div> <p>Teflon gaskets are durable across a wide temperature range from -200°C to +260°C.</p> </div>"),
 ]),
784: dict(
 en_name="Soft Packings",
 en_summary="Soft Packings – High Sealing Performance and Durability",
 en_description_html="<div> <p><strong>Soft packings</strong> are elastic sealing elements that provide <strong>sealing and mechanical isolation</strong> by closing the gap between the shaft and the housing. They are widely used in pipeline systems, pumps, valves, rotor shaft connections and industrial mechanisms to prevent leaks of water, oil, fuel and various fluids.</p><p>HD Marine soft packings deliver long-lasting performance with their <strong>flexible structure, high chemical compatibility and durable material</strong>.</p> </div><div> <p>✔ <strong>Superior sealing:</strong> Effectively prevents liquid and gas leaks<br/>✔ <strong>Flexible and conformable:</strong> Full seating on the shaft surface and stretching capability<br/>✔ <strong>Chemical resistance:</strong> Resistance to water, oil, fuel and mild chemicals<br/>✔ <strong>Low friction:</strong> Minimizes wear<br/>✔ <strong>Easy installation:</strong> Practical and fast setup</p> </div>",
 en_usage_areas_html="<div> <p>HD Marine soft packings provide <strong>sealing and long-life performance</strong> particularly in:</p><ul><li>Industrial <strong>pump and valve shafts</strong></li><li><strong>Pipelines</strong> and process circuits</li><li>Marine and shipping applications</li><li>Engine rooms and mechanical systems</li><li>Pressurized system connections</li></ul><p>and similar operations.</p> </div>",
 faqs=[
  ("What is a soft packing?", "<div> <p>A soft packing is a flexible sealing element that prevents liquid or gas leaks by closing the gaps between the shaft and the hub.</p> </div>"),
  ("From which materials is it made?", "<div> <p>It is generally produced from NBR, Viton, neoprene or elastomer compounds; the choice depends on the application.</p> </div>"),
  ("Where is it used?", "<div> <p>It is used on pump shafts, valves, rotor connections and process piping.</p> </div>"),
  ("What is its temperature resistance?", "<div> <p>Depending on the material, it can withstand temperatures in the range of -40°C to +120°C.</p> </div>"),
 ]),
789: dict(
 en_name="Hatch Cover Tapes",
 en_summary="Hatch Cover Tapes – Marine and Industrial Sealing Solution",
 en_description_html="<div> <p><strong>Hatch cover tapes</strong> are special tapes designed to <strong>provide sealing and insulation for hatch covers</strong> on ships, marine vessels and industrial facilities. They are resistant to vibration, water or oil contact occurring during operation, and by forming an effective barrier at cover joints they <strong>prevent water ingress, smoke passage and corrosion.</strong></p><p>HD Marine hatch cover tapes provide reliable sealing in both the marine and industrial sectors with their long-lasting flexible structure and high resistance.</p> </div><div> <p>✔ <strong>High sealing performance:</strong> Effective barrier against water, oil, dust and contamination<br/>✔ <strong>Flexible and durable material:</strong> Adapts to vibration and temperature changes<br/>✔ <strong>Easy application:</strong> Fast installation in tape form<br/>✔ <strong>Resistance to UV and weather conditions:</strong> Long life in marine and outdoor environments<br/>✔ <strong>Wide range of use:</strong> Hatch covers, valve covers, door/frame sealing</p> </div>",
 en_usage_areas_html="<div> <p><strong>Hatch cover tapes provide high resistance and reliable sealing, particularly in:</strong></p><ul><li>Hatch cover sealing on ships</li><li>Cover and frame insulation on marine vessels</li><li>Industrial cover, valve and panel connections</li><li>Applications preventing water and oil passage</li><li>Sealing on vibrating surfaces</li></ul><p>and similar applications.</p> </div>",
 faqs=[
  ("What is a hatch cover tape?", "<div> <p>A hatch cover tape is a sealing material that prevents the ingress of water, air and contamination at cover and frame joints.</p> </div>"),
  ("With which materials is it compatible?", "<div> <p>It has an elastomeric structure compatible with most metals, plastics, composites and marine surfaces.</p> </div>"),
  ("How is it applied?", "<div> <p>After the surface is cleaned, a tape of suitable width is selected and applied; the adhesive surface is reinforced.</p> </div>"),
  ("Is it durable in a marine environment?", "<div> <p>Yes, it is manufactured with material resistant to UV, salt water and weather conditions.</p> </div>"),
 ]),
1057: dict(
 en_name="Pipe Repair Clamps",
 en_summary="Pipe Repair Clamps – Fast and Reliable Pipe Repair Solution",
 en_description_html="<div> <p><strong>Pipe repair clamps</strong> are connection elements used to <strong>repair damage such as leaks, cracks or holes in pipes quickly, practically and safely</strong>. They save time and money by returning piping systems to service across different application areas, from industrial facilities to marine lines.</p><p>HD Marine pipe repair clamps, with their durable construction, quality materials and easy installation advantage, provide an effective solution for <strong>water, oil, fuel and other fluid lines</strong>.</p> </div><div> <p>✔ <strong>Fast installation:</strong> Simply tighten the bolts<br/>✔ <strong>Suitable for various pipe diameters:</strong> From 15 mm up to 500 mm<br/>✔ <strong>Durable gasket:</strong> Broad fluid compatibility with EPDM / NBR options<br/>✔ <strong>High pressure resistance:</strong> Suitable for industrial lines<br/>✔ <strong>Corrosion resistance:</strong> Galvanized or stainless options</p> </div>",
 en_usage_areas_html="<div> <ul><li>Industrial process piping</li><li>Marine machinery and line systems</li><li>Water and wastewater facilities</li><li>Fuel and oil transfer lines</li><li>Chemical pipelines</li></ul><p>Pipe repair clamps provide a fast and economical solution for stopping a pipeline failure or making a temporary repair.</p> </div>",
 faqs=[
  ("What is a pipe repair clamp?", "<div> <p>A pipe repair clamp is a connection element used to close leaks, cracks and holes in pipelines quickly and practically.</p> </div>"),
  ("For which pipe diameters is it used?", "<div> <p>It can be used on pipelines of various diameters from 25 mm up to 300 mm.</p> </div>"),
  ("For which fluids is it suitable?", "<div> <p>With its durable gasket and material, it is suitable for different fluid lines such as water, oil, fuel and chemicals.</p> </div>"),
  ("Is installation difficult?", "<div> <p>No. Thanks to the bolted system, it provides fast and easy installation.</p> </div>"),
 ]),
1062: dict(
 en_name="Pipe Repair Bandage",
 en_summary="Pipe Repair Bandage – A Practical and Permanent Repair Solution",
 en_description_html="<div> <p>A <strong>pipe repair bandage</strong> is an <strong>after-production repair bandage</strong> used to quickly repair damage such as cracks, tears or abrasions in pipelines. Thanks to its elastic and durable structure, it enables pipes that will not close, are leaking or have been damaged to return to service in a short time.</p><p>HD Marine pipe repair bandages offer an effective repair solution in marine, industrial and infrastructure applications with their <strong>high strength</strong>, <strong>corrosion resistance</strong> and <strong>long service life</strong>.</p> </div><div> <p>✔ <strong>Fast application:</strong> Applied practically by wrapping<br/>✔ <strong>Durable material:</strong> High strength with fiberglass + epoxy<br/>✔ <strong>Suitable for various pipe diameters:</strong> Use from 25 to 250 mm<br/>✔ <strong>High pressure resistance:</strong> Suitable for industrial facilities<br/>✔ <strong>Corrosion resistance:</strong> Resistant to fluids such as water, oil and chemicals</p> </div><div> <p><strong>🛠️ Where Is It Used?</strong></p><p>HD Marine pipe repair bandages provide reliable and fast solutions for <strong>leak and damage repair</strong> particularly in:</p><ul><li>Water and wastewater lines</li><li>Fuel and oil transfer pipes</li><li>Industrial process lines</li><li>Marine and engine room applications</li><li>Chemical line repairs</li></ul><p>and other different sectors.</p> </div>",
 en_usage_areas_html=None,
 faqs=[
  ("What is a pipe repair bandage?", "<div> <p>A pipe repair bandage is a reinforcement bandage used to repair cracked or damaged pipelines in a practical and durable way.</p> </div>"),
  ("For which pipe diameters is it suitable?", "<div> <p>Thanks to bandages of various widths, it can be used on pipe diameters from 25 mm up to 600 mm.</p> </div>"),
  ("How is it applied?", "<div> <p>After the damaged area is cleaned, the bandage is wrapped and pressure is applied over it; it hardens in a short time.</p> </div>"),
  ("On which pipe types can it be used?", "<div> <p>It can be used safely on water, oil, fuel and most industrial fluid lines.</p> </div>"),
 ]),
1072: dict(
 en_name="Marine Chemicals",
 en_summary="Marine Chemicals – Professional Solutions for Shipping and Marine Applications",
 en_description_html="<div> <p>The HD Marine marine chemicals category includes <strong>chemical products specially formulated for ship maintenance, cleaning, protection and improving operational performance in the maritime sector</strong>. These products cover a wide range of uses, from ship surface maintenance to fuel and oil systems, from ship cleaning to environmental protection applications.</p><p>Delivering high performance under demanding conditions at sea, marine chemicals provide reliable solutions for both commercial vessels and yacht/boat owners.</p> </div><div> <p>HD Marine marine chemicals are used for the following purposes:</p><ul><li>🛥️ <strong>Ship surface cleaning and polishing</strong></li><li>🛠️ <strong>Engine, fuel and oil system maintenance</strong></li><li>🛡️ <strong>Corrosion-inhibiting and rust-dissolving applications</strong></li><li>♻️ <strong>Wastewater treatment and environmental protection support products</strong></li><li>⛽ <strong>Fuel additives and performance enhancers</strong></li></ul><p>These products are formulated to suit the characteristics of the marine environment and offer <strong>high effectiveness with low environmental impact</strong>.</p> </div><div> <p>✔ Optimized for maritime conditions<br/>✔ Highly effective formulation<br/>✔ Non-abrasive, safe use<br/>✔ Environmentally friendly alternatives available<br/>✔ Compliant with industrial and marine standards</p> </div><div> <ul><li><strong>Ship surface cleaners</strong> – Salt water, oil and dirt removers</li><li><strong>Engine and machinery maintenance chemicals</strong> – Protective oils, rust removers</li><li><strong>Fuel additives</strong> – Performance and fuel efficiency enhancers</li><li><strong>Antifreeze and water removers</strong> – Freezing, moisture and corrosion prevention</li><li><strong>Wastewater and environmental products</strong> – Treatment chemicals compliant with environmental standards</li></ul><p>Each product category delivers professional results aimed at optimizing ship maintenance processes and increasing operational efficiency.</p> </div>",
 en_usage_areas_html=None,
 faqs=[
  ("What are marine chemicals used for?", "<div> <p>Marine chemicals are specially formulated products for cleaning, maintenance, surface protection and improving system performance in the marine environment.</p> </div>"),
  ("Which marine chemicals are available?", "<div> <p>Various categories are available, such as surface cleaners, engine maintenance products, fuel additives, rust dissolvers and environmental products.</p> </div>"),
  ("Is it safe to use in a marine environment?", "<div> <p>HD Marine products are formulated for safe use in compliance with maritime standards.</p> </div>"),
  ("Are the chemicals environmentally friendly?", "<div> <p>Many products have environmentally friendly formulations compliant with environmental standards.</p> </div>"),
 ]),
1077: dict(
 en_name="Thermal Label",
 en_summary="Temperature Indicator Labels – Instant and Permanent Heat Monitoring Solutions",
 en_description_html="<div> <p><strong>Temperature indicator labels</strong> are practical and reliable measurement solutions that provide temperature monitoring by changing color or leaving a permanent mark when a specific temperature level is reached. They operate without requiring electronic sensors and offer fast checks particularly on <strong>industrial equipment, pipelines, motors, electrical panels and in shipping processes</strong>.</p><p>HD Marine temperature indicator labels are an effective solution for <strong>overheating detection</strong>, <strong>process control</strong>, <strong>maintenance planning</strong> and <strong>transport safety</strong>.</p> </div><div> <p>These labels:</p><ul><li>Activate within a predetermined temperature range</li><li>Provide a visual warning by changing color</li><li>Can be single-use (irreversible) or multi-level</li><li>Require no external power source</li></ul><p>They are used as an early warning mechanism, particularly in systems at risk of overheating.</p> </div>",
 en_usage_areas_html="<div> <p>Temperature indicator labels are used for <strong>instant heat monitoring and overheating detection</strong> particularly in areas such as:</p><ul><li>Electrical panels</li><li>Motor and gearbox systems</li><li>Steam lines</li><li>Industrial machinery</li><li>Transport and logistics (temperature-controlled products)</li><li>Marine engine rooms</li></ul> </div><div> <p>✔ Requires no electronic sensors<br/>✔ Easy application (stick and use)<br/>✔ Low-cost temperature monitoring<br/>✔ Visual and fast inspection capability<br/>✔ Provides early warning in maintenance processes</p> </div>",
 faqs=[
  ("How does a temperature indicator label work?", "<div> <p>When the defined temperature level is reached, it changes color through a chemical reaction and leaves a permanent mark.</p> </div>"),
  ("Can it be reused?", "<div> <p>It is generally single-use; once the temperature threshold is exceeded, an irreversible color change occurs.</p> </div>"),
  ("Where can it be used?", "<div> <p>It can be used on motors, panels, pipelines, shipping boxes and heat-sensitive equipment.</p> </div>"),
  ("In which temperature range does it operate?", "<div> <p>Depending on the model, different threshold options are available from 30°C up to 260°C.</p> </div>"),
 ]),
2068: dict(
 en_name="Industrial Chemicals",
 en_summary=None,
 en_description_html="<div> <p>Metal surface treatment chemicals play a critical role in the <strong>cleaning, preparation, protection and coating</strong> processes of metal surfaces in industrial applications. The high-performance chemical solutions we offer at HD Marine increase production efficiency while raising surface quality to the maximum level.</p><p>Our broad product portfolio has been specially developed for <strong>oil, dirt and oxide removal</strong>, surface activation, corrosion protection and pre-coating preparation processes. It can be used safely on different surface types, including iron and steel, stainless steel, aluminum and alloyed metals.</p> </div><div> <p>Cleaning chemicals used in preparing metal surfaces before coating or assembly ensure the effective removal of all unwanted residues from the surface.</p> </div><div> <ul><li>Industrial oil and grease removers</li><li>Alkaline and acidic cleaners</li><li>Rust and oxide removers</li><li>Pre-phosphate surface preparation chemicals</li><li>Solvent-based and water-based cleaners</li></ul> </div><div> <ul><li>High cleaning performance</li><li>Effective results without damaging the surface</li><li>Excellent surface preparation before coating</li><li>Time and cost savings in work processes</li></ul> </div><div> <p>Coating chemicals protect metal surfaces against external factors while also imparting aesthetic and functional properties.</p> </div><div> <ul><li>Phosphating chemicals (zinc, iron, manganese)</li><li>Passivation and protective coating products</li><li>Corrosion-inhibiting chemicals</li><li>Pre-paint surface preparation chemicals</li><li>Temporary protective film and coating solutions</li></ul> </div><div> <ul><li>Long-term corrosion resistance</li><li>Improved coating and paint adhesion performance</li><li>Durability under demanding industrial conditions</li><li>Achieving a homogeneous, high-quality surface</li></ul> </div><div> <ul><li>Shipping and ship maintenance-repair</li><li>Iron-steel and metalworking industry</li><li>Automotive and supplier industry</li><li>Chemical and process industries</li><li>Energy and heavy industry facilities</li></ul> </div><div> <ul><li>Products meeting high quality standards</li><li>Formulation options tailored to different processes</li><li>Fast supply and competitive price advantage</li><li>Technical consultancy and field support</li></ul> </div>",
 en_usage_areas_html=None,
 faqs=[]),
2493: dict(
 en_name="Sine Lobe Pump",
 en_summary="Lobe Pump – High-Efficiency Positive Displacement Transfer",
 en_description_html="<div> <p>A <strong>lobe pump (rotary lobe pump)</strong> is a type of positive displacement pump consisting of lobed rotors. Thanks to this design, it provides <strong>low shear, high efficiency and precise flow control</strong>. Sine lobe pumps are the ideal solution for handling <strong>viscous liquids, particle-laden fluids and delicate products</strong> without problems.</p><p>HD Marine sine lobe pumps, with their durable body construction and superior performance, deliver <strong>uninterrupted liquid transfer</strong> in industrial facilities, marine applications and production lines.</p> </div><div> <ul><li>🌟 <strong>High performance:</strong> Constant flow rate and low energy consumption</li><li>⚙ <strong>Product safety:</strong> Low shear preserves product structure</li><li>🧰 <strong>Easy maintenance:</strong> Fast cleaning and maintenance after use</li><li>🏭 <strong>Broad application compatibility:</strong> Food, chemicals, marine and industry</li></ul> </div>",
 en_usage_areas_html="<div> <p>HD Marine lobe pumps are preferred particularly in the following sectors:</p><ul><li><strong>Food and beverage production</strong> (e.g. syrups, sauces)</li><li><strong>Chemical and pharmaceutical processes</strong></li><li><strong>Wastewater and filtration systems</strong></li><li><strong>Paint, ink and solvent transfer lines</strong></li><li><strong>Marine and industrial applications</strong></li></ul><p>The breadth of application areas makes sine lobe pumps highly versatile.</p> </div>",
 faqs=[
  ("What is a lobe pump?", "<div> <p>It is a type of pump operating with positive displacement lobed rotors, providing liquid transfer at a constant flow rate.</p> </div>"),
  ("With what kinds of liquids is it used?", "<div> <p>It is used with fluids requiring delicate transfer, such as viscous liquids, particle-laden fluids, food products and chemicals.</p> </div>"),
  ("What is the advantage of a lobe pump?", "<div> <p>With low shear, it minimizes product degradation and provides constant flow.</p> </div>"),
  ("Who should choose it?", "<div> <p>Food, pharmaceutical and chemical production plants, and all industrial applications requiring delicate fluid transfer.</p> </div>"),
 ]),
2559: dict(
 en_name="Anti Splashing Tape",
 en_summary="Anti Splashing Tape – Sealing and Splash Prevention Tape",
 en_description_html="<div> <p><strong>Anti Splashing Tape</strong> is a high-performance sealing tape designed to prevent <em>liquid splashing</em>, <em>leakage</em> and <em>contamination</em> at pipe connections, joints and vibrating surfaces. It is used particularly in marine, industrial and maritime applications. Thanks to its durable structure, it provides long-lasting protection.</p><p>HD Marine Anti Splashing Tape is an <strong>easy-to-apply</strong> solution <strong>resistant to water, oil and chemical splashes</strong>, providing safe sealing at connection points requiring maintenance.</p> </div><div> <p>✔ <strong>Highly resistant sealing</strong> – Protects against water, oil and chemical splashes<br/>✔ <strong>Flexible and durable structure</strong> – Effective performance even under vibration<br/>✔ <strong>Easy application</strong> – Fast installation in tape form<br/><span>✔</span> <strong>Broad compatibility</strong> – On pipe connection elements and mounting surfaces<br/>✔ <strong>Long-lasting use</strong> – Resistant to wear and deformation</p> </div>",
 en_usage_areas_html="<div> <p>Anti Splashing Tape offers an effective sealing solution particularly in:</p><ul><li><strong>Pipe joints and connections</strong></li><li><strong>Surfaces subject to machine vibration</strong></li><li><strong>Marine engine rooms</strong></li><li><strong>Industrial facility lines</strong></li><li><strong>Splash and leak prevention in oil / fuel / water systems</strong></li></ul><p>and similar applications.</p> </div>",
 faqs=[
  ("What is Anti Splashing Tape?", "<div> <p>Anti Splashing Tape is a highly resistant sealing tape used to prevent splashing and leakage at pipe connections.</p> </div>"),
  ("On which surfaces is it used?", "<div> <p>It is used on pipe connections, assembly joints and vibrating surfaces.</p> </div>"),
  ("To which fluids is it resistant?", "<div> <p>Thanks to its material structure resistant to water, oil and mild chemical splashes, it provides safe sealing.</p> </div>"),
  ("Is it difficult to apply?", "<div> <p>No, thanks to its tape form it is applied easily; no special tools are required.</p> </div>"),
 ]),
2736: dict(
 en_name="Wilden® Compatible Spare Parts",
 en_summary="Wilden® Compatible Spare Parts",
 en_description_html="<div> <div><p>WILDEN PUMP, one of the pioneering companies in its field, having developed the first compressed-air-operated diaphragm pumps in 1955, has held a leading position in the air-operated double diaphragm pump market from the very beginning. Since 1998, as part of the Dover Group, it has continued to rise, standing apart from its competitors in product variety and technology. HD Marine, since its founding, has worked with leading companies and manufacturers. It offers its customers suitable equipment and products in line with their needs, pump and spare part support, after-sales support, engineering services, and procurement and installation processes.</p></div> </div><div> <div><p>For Air-Operated Double Diaphragm Pumps, you can find many Wilden-brand-compatible spare parts you may need at HD Marine, such as diaphragms, seats, balls, pistons, gaskets, air valves, O-rings, hardware, clamp bands, mufflers and repair kits.</p><p>Wilden Type pump and spare part support is provided to the user in line with requirements and according to different places of use. One of the most important features of Wilden Type pumps is that they operate with energy-saving air distribution technology and, with a wide range of material options, are models that perform successfully in high-pressure applications without stalling or freezing.</p><p>Wilden Type pumps are divided into four main categories according to their areas of use: Metal-Bodied Air-Operated Double Diaphragm Pumps, Plastic-Bodied Air-Operated Double Diaphragm Pumps, Metal-Bodied High-Pressure Pumps, and Plastic Magnetically Coupled Centrifugal Pumps. Outside this group, Wilden Type pumps and spare parts used in different fields such as food applications and mining applications are also available.</p><p>The areas where Wilden Type pumps and spare parts are used generally include various applications such as alcohol, chemical treatment, acid / alkali / chemical, paint and pigment, drainage applications, petroleum-derived liquids, ceramic slip, glaze, and oil and solvent transfer.</p></div> </div>",
 en_usage_areas_html=None,
 faqs=[]),
2740: dict(
 en_name="Aro® Compatible Spare Parts",
 en_summary="Aro® Compatible Spare Parts",
 en_description_html="<div> <div><p>Aro® first launched its air-operated double diaphragm pump product in the eighties in Bryan, Ohio (United States). Today, ARO® is part of Ingersoll Rand Corp. and is one of the leading AODD Pump brands.</p></div> </div><div> <div><p>ARO® air-operated diaphragm pumps have the capacity to handle a variety of viscous fluids and ensure non-stalling, ice-free operation. The unbalanced air valve design prevents the stalling problems associated with other pumps. Quick-dump exhaust valves direct cold exhaust air away from ice-prone components and prevent freezing. Depending on the type of liquid to be discharged, piston pump packages are available with multiple configurations for the pump section, including single-body, two-body or heavy-duty two-body designs.</p><p>ARO® diaphragm pumps, with their cost-effectiveness and reliable construction, are a good choice for industrial and chemical applications. The bolted, leak-free design eliminates cross-contamination and increases operator safety. The modular design, reduced part count and easy-to-use repair kits also minimize product repair time when needed.</p><p>HD Marine brings you reliable, quality products with spare parts compatible with double diaphragm (AODD) Pumps. HD Marine provides spare product support for many parts according to your preference, and is an address where you can find Aro spare parts such as <strong>valve balls, valve seats, diaphragms, gaskets, clamp bands, mufflers, pistons and valve rings</strong>.</p><p>In the event of any failure or maintenance need for Diaphragm Pumps, you can select Aro-brand-compatible products individually through the HD Marine site, or from the <strong>Aro Service Kits</strong> section you can access a service/repair kit containing screws, gaskets and many ring varieties together. Service kits come in two types: a wet kit for the wet side of your pneumatic double diaphragm pump, and a kit used for the maintenance and repair of the air side of your air-operated double diaphragm pump. Since these two kits contain different products, you should make your choice by considering which products you need and in which area you will use them.</p><p>Apart from <strong>Aro Service Kits</strong>, when you want to purchase products individually, you can also find <strong>Aro gaskets, Aro rings, Aro valve balls, Aro valve seats, Aro hardware and Aro diaphragms</strong>. However, it should be kept in mind that the area in which each industry uses its pumps, and the appropriate Aro spare part product for that area, will vary. According to your specific application needs such as chemical compatibility, temperature and sealing capacity, HD Marine offers its customers the most widely used and preferred quality materials and products in pump parts, such as <strong>Santoprene, Hytrel, N-fit, PTFE and Neoprene</strong>.</p></div> </div>",
 en_usage_areas_html=None,
 faqs=[]),
2742: dict(
 en_name="Sandpiper® Compatible Spare Parts",
 en_summary="Sandpiper® Compatible Spare Parts",
 en_description_html="<div> <div><p>HD Marine delivers to its users the highest-quality spare parts compatible with the Sandpiper® brand. It has a complete, wide range of wear parts for Air-Operated Double Diaphragm Pumps, such as diaphragms, seats, balls, pistons, gaskets, air valves, O-rings, hardware, clamp bands, shafts, mufflers and repair kits.</p></div> </div><div> <div><p>The <strong>Sandpiper® air valve</strong> is one of the main elements of an Air-Operated Double Diaphragm pump. Sandpiper pumps use both internal air valve and external air valve designs and locations. The materials used in the air valve body can vary in quality, such as brass, aluminum, plastic or stainless steel. In <strong>diaphragm pumps, the air valves</strong> are positioned between the diaphragms, right at the center of the pump. In this way, air passages and dead volumes are reduced to a minimum. HD Marine also provides its customers with the highest-quality spare part support compatible with Sandpiper.</p><p>A diaphragm pump operates on compressed air. The functional operation of the <strong>valve seats</strong> and <strong>valve balls</strong>, moving back and forth to pump the liquid, is what makes it work. Valve seats and valve balls are critical components for the proper operation of an air-operated double diaphragm pump. <strong>Valve balls and valve seats in Air-Operated Double Diaphragm Pumps</strong> are found in many sectors such as aerospace, environment, energy, automotive, construction, chemicals, ceramics, cosmetics, food and beverage, oil and gas, packaging, steel and metals, and pharmaceuticals.</p><p>As an important part of the general maintenance program, <strong>diaphragms</strong> should be replaced at regular intervals according to the manufacturer's recommendations. A double diaphragm pump uses two flexible diaphragms connected to each other by a shaft moving back and forth, and is also known as a positive displacement pump. The role of the diaphragms is to operate in a way that separates the air on one side from the medium on the other side.</p><p>For questions or problems regarding the <strong>valve seats, valve balls, air valve, diaphragm</strong> or <strong>hardware</strong> of your Air-Operated Double Diaphragm Sandpiper Pump, please contact our professional team members working in HD Marine spare Pump Parts. We would be happy to assist you and reach a solution for your issues with spare parts compatible with Sandpiper-brand products.</p></div> </div>",
 en_usage_areas_html=None,
 faqs=[]),
2743: dict(
 en_name="Blagdon® Compatible Spare Parts",
 en_summary="Blagdon® Compatible Spare Parts",
 en_description_html="<div> <p>HD Marine serves its customers with spare parts compatible with Blagdon products, in varieties made of materials that change according to the area of use. Diaphragm pumps are used in various applications such as alcohol, chemical treatment, acid / alkali / chemical, paint and pigment, drainage applications, petroleum-derived liquids, ceramic slip, glaze, and oil and solvent transfer. At HD Marine you can find various Blagdon spare part products such as valve balls, valve seats, diaphragms, hardware, rings, gaskets and repair kits.</p> </div><div> <p>In a diaphragm pump's operation on compressed air and in pumping the liquid, the valve seats and valve balls have an important function, moving back and forth. For the pump to operate properly, every part used must be of high quality, robust and made of material suitable for the area in which it will be used. For example, <strong>Valve Ball Neoprene Fit Blagdon Pumps Parts</strong> should be used for non-aggressive liquid applications; <strong>Valve Ball PTFE Fit Blagdon Pumps Parts</strong> when pumping aggressive liquids; <strong>Valve Ball BUNA-N/Nitrile Fit Blagdon Pumps Parts</strong> when pumping petroleum oil-based liquids; <strong>Valve Ball FKM Fit Blagdon Pumps Parts</strong> for liquids such as aggressive acids requiring extreme temperatures; and <strong>Valve Ball EPDM/ Blagdon Pumps Parts</strong> materials for dilute acids requiring extreme cold. Although Blagdon balls products look similar in appearance, their material and color code change according to the area in which they will be used.</p><p>HD Marine also offers material options in Blagdon diaphragm spare part products. The most widely used materials, in varieties such as Neoprene, EPDM, Nitrile and PTFE, reach customers in different sizes and with color codes. Through the HD Marine site you can access the <strong>Blagdon Valve Ball and Blagdon Diaphragm</strong> spare parts you need and review the products. For your questions and requests, you can reach our professional colleagues in the field and obtain information about Blagdon spare part varieties.</p> </div>",
 en_usage_areas_html=None,
 faqs=[]),
}

def slugify(name):
    s = name.replace("®", "").replace("&", " and ")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

def plain_text(html):
    t = re.sub(r"<[^>]+>", " ", html)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def meta_desc(html):
    if not html:
        return None
    t = plain_text(html)
    if len(t) <= 155:
        return t
    cut = t[:155]
    cut = cut[:cut.rfind(" ")] if " " in cut else cut
    return cut.rstrip(" ,;:.") + "…"

def dq(s):
    if s is None:
        return "NULL"
    assert "$h$" not in s, "dollar-quote collision"
    return "$h$" + s + "$h$"

with open(INPUT, encoding="utf-8") as f:
    records = json.load(f)

stmts = []
n_prod = n_faq = 0
for r in records:
    wp = r["wp_id"]
    t = T[wp]
    assert len(t["faqs"]) == len(r.get("faqs") or []), f"faq count mismatch wp {wp}"
    pt_id = uuid.uuid5(NS, f"hdm-ptr-en-{wp}")
    name = t["en_name"]
    slug = slugify(name)
    mt = name + " | HD Marine"
    md = meta_desc(t["en_description_html"])
    stmt = (
        "INSERT INTO product_translations (id, product_id, locale, name, slug, summary, description, usage_areas, meta_title, meta_description, translation_status) VALUES ("
        f"'{pt_id}', '{r['product_uuid']}', 'en', {dq(name)}, {dq(slug)}, {dq(t['en_summary'])}, {dq(t['en_description_html'])}, {dq(t['en_usage_areas_html'])}, {dq(mt)}, {dq(md)}, 'auto') ON CONFLICT DO NOTHING;"
    )
    stmts.append(stmt)
    n_prod += 1
    for src, (q, a) in zip(r.get("faqs") or [], t["faqs"]):
        ft_id = uuid.uuid5(NS, f"hdm-faqtr-en-{wp}-{src['i']}")
        stmts.append(
            "INSERT INTO product_faq_translations (id, faq_id, locale, question, answer) VALUES ("
            f"'{ft_id}', '{src['faq_uuid']}', 'en', {dq(q)}, {dq(a)}) ON CONFLICT DO NOTHING;"
        )
        n_faq += 1

os.makedirs(SQL_DIR, exist_ok=True)
full_path = os.path.join(SQL_DIR, "products-en-01.sql")
with open(full_path, "w", encoding="utf-8") as f:
    f.write("\n".join(stmts) + "\n")

# chunking at statement boundaries, ~35KB each
chunks, cur, cur_len = [], [], 0
for s in stmts:
    b = len(s.encode("utf-8")) + 1
    if cur and cur_len + b > 35000:
        chunks.append(cur); cur, cur_len = [], 0
    cur.append(s); cur_len += b
if cur:
    chunks.append(cur)

for i, ch in enumerate(chunks, 1):
    p = os.path.join(SQL_DIR, f"products-en-01.part{i:02d}.sql")
    with open(p, "w", encoding="utf-8") as f:
        f.write("BEGIN;\n" + "\n".join(ch) + "\nCOMMIT;\n")

print(f"products={n_prod} faqs={n_faq} statements={len(stmts)} chunks={len(chunks)}")
print(f"full sql bytes={os.path.getsize(full_path)}")
for i in range(1, len(chunks) + 1):
    p = os.path.join(SQL_DIR, f"products-en-01.part{i:02d}.sql")
    print(p, os.path.getsize(p))
