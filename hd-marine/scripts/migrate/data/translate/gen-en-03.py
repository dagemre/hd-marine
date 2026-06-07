# -*- coding: utf-8 -*-
"""Generate EN translation SQL for batch 03 (24 products, 0 FAQs)."""
import json, re, sys, unicodedata, uuid, html as htmlmod
from pathlib import Path

BASE = Path(__file__).resolve().parent
INPUT = BASE / "input-03.json"
OUT = BASE.parent / "sql" / "en" / "products-en-03.sql"
NS = uuid.UUID("8f0c2c1e-5b7a-4b54-9a4e-1d2000000000")

ARO_DESC = (
    "<div> <div><p>Aro® first introduced its air-operated double diaphragm pump in the 1980s in Bryan, Ohio "
    "(United States). Today, ARO® is part of Ingersoll Rand Corp. and one of the leading AODD Pump brands.</p></div> </div>"
    "<div> <div><p>ARO® air-operated diaphragm pumps have the capacity to transfer a wide range of viscous fluids and "
    "provide stall-free, ice-free operation. The unbalanced air valve design prevents the stalling problems associated "
    "with other pumps. Quick-dump exhaust valves direct cold exhaust air away from ice-prone components and prevent "
    "freezing. Depending on the type of fluid to be transferred, piston pump packages are available in multiple "
    "configurations, including single-body, two-body and heavy-duty two-body versions.</p>"
    "<p>ARO® diaphragm pumps are a good choice for industrial and chemical applications thanks to their cost-effectiveness "
    "and reliable construction. The bolted, leak-free design eliminates cross-contamination and increases operator safety. "
    "Their modular structure, reduced part count and easy-to-use repair kits also minimize repair time when service is "
    "required.</p>"
    "<p>HD Marine brings you reliable, high-quality spare parts compatible with double diaphragm (AODD) pumps. In addition "
    "to providing replacement support for many parts of your choice, HD Marine is the place to find Aro spare parts such as"
    "<strong> valve balls, valve seats, diaphragms, gaskets, clamp bands, mufflers, pistons and valve rings</strong>.</p>"
    "<p>In the event of any failure or maintenance on diaphragm pumps, you can select individual Aro-compatible products "
    "on the HD Marine website, or visit the <strong>Aro Service Kits</strong> section to access service/repair kits that "
    "combine screws, gaskets and a wide variety of rings. Service kits come in two types: a wet-end kit for the wet "
    "section of your pneumatic double diaphragm pump, and a kit used for the maintenance and repair of the air side of "
    "your air-operated double diaphragm pump. Since these two kits contain different products, you should make your choice "
    "by considering which products you need and where you will use them.</p>"
    "<p>If you prefer to purchase items individually rather than <strong>Aro Service Kits</strong>, you can also browse "
    "<strong>Aro gaskets, Aro rings, Aro valve balls, Aro valve seats, Aro hardware and Aro diaphragms</strong>. However, "
    "keep in mind that the application area in which each industry uses its pumps — and the appropriate Aro spare part for "
    "that area — will vary. To match your specific application needs such as chemical compatibility, temperature and "
    "sealing capacity, HD Marine offers its customers the most widely used and preferred quality materials and products "
    "for pump parts, such as <strong>Santoprene, Hytrel, N-fit, PTFE and Neoprene</strong>.</p></div> </div>"
)

def drain_pan_desc(model, litres):
    return (
        "<div> <div><p><strong>Why the {m} Waste Oil Drain Pan?</strong></p><p>We designed the {l}-liter mobile waste oil "
        "collection pan so you can quickly and easily collect large volumes of waste oil, coolant, brake fluid, "
        "transmission oil and power steering fluid. It is a practical solution. Thanks to the integrated wheels, you can "
        "move this oil pan with ease. In addition, the quick-coupling connection lets you complete draining "
        "quickly.</p></div> </div>"
    ).format(m=model, l=litres)

SVS44_DESC = (
    "<div> <div><p><strong>Why the SVS4400 Mobile Oil Drum System?</strong></p><p>Offered in many versions for different "
    "purposes, the mobile oil dispensing trolley delivers very high working capability thanks to pump options with "
    "different output and pressure ratios, hose lengths of up to 20 meters, and liter-metered guns you can add according "
    "to your needs. Taking the different needs of every business into account, we offer you an excellent solution. The "
    "drum trolley, which we manufacture from quality sheet steel and finish with electrostatic paint, is highly "
    "maneuverable thanks to its two swivel and two fixed wheels. The SVS4400 oil drum system consists of four standard "
    "components; however, you can build different sets by choosing your own oil pump, oil gun and oil hose "
    "length.</p></div> </div>"
)

def gun_4106_desc(model, fluid, opening):
    return (
        "<div> <div><p><strong>Why the {m} Metered {f} Gun?</strong></p><p>{o} has an oval gear design and is a "
        "manageable, ergonomic tool for controlling and managing {fl} dispensing. The meter body is made of die-cast "
        "aluminum resistant to high pressures. It is easy to calibrate and features an electronic reset function. In "
        "addition to low battery consumption, it carries an IP65 protection rating.</p></div> </div>"
    ).format(m=model, f=fluid, o=opening, fl=fluid.lower())

TR = {
    4256: {
        "name": "Mechanical Rotary Gear Oil Pump 18 L – 4018",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 4018 Mechanical Rotary Gear Oil Pump?</strong></p><p>The mechanical rotary "
            "gear oil pump has an 18 L capacity. It is used for topping up transmission and differential oils. The "
            "rotary transmission oil pump uses a ½ ” fabric-reinforced hose. It has two wheels and, being lightweight, "
            "can be moved around easily; in addition, the foot pedal keeps the oil dispenser steady during operation. "
            "It offers great convenience in facilities without a compressed air system.</p></div> </div>"
        ),
    },
    4270: {
        "name": "Pneumatic Oil Extraction Pumps",
        "summary": "Aro® Compatible Spare Parts",
        "desc": ARO_DESC,
    },
    4276: {
        "name": "Drum Faucet – 44387",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 44387 Drum Faucet?</strong></p><p>Drum faucets are an excellent solution for "
            "conveniently dispensing fluid from 210-liter drums. It is made of polyethylene. These faucets allow fluids "
            "to be dispensed easily under gravity flow when the drum is positioned horizontally.</p></div> </div>"
        ),
    },
    4281: {
        "name": "Oil Spill Containment Basin 125 L – YTK2",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the YTK2 Oil Spill Containment Basin?</strong></p><p>In accordance with "
            "occupational safety and environmental waste regulations, leak- and overflow-preventing containment basins "
            "must be used when emptying or filling chemicals and hazardous waste.</p><p>For 2 drums of 208 liters "
            "each;<br/>Durable and long-lasting thanks to edge profiles on both sides. Easy and safe handling with "
            "forklifts, stackers and pallet trucks.</p></div> </div>"
        ),
    },
    4282: {
        "name": "Oil Spill Containment Basin 425 L – YTK1",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the YTK1 Oil Spill Containment Basin?</strong></p><p>In accordance with "
            "occupational safety and environmental waste regulations, leak- and overflow-preventing containment basins "
            "must be used when emptying or filling chemicals and hazardous waste.</p><p>For 1 IBC tank of 1000 "
            "liters;<br/>Durable and long-lasting thanks to edge profiles on both sides. Easy and safe handling with "
            "forklifts, stackers and pallet trucks.</p></div> </div>"
        ),
    },
    4283: {
        "name": "Waste Oil Drain Pan Channel Type 65 L – AYT3",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the AYT3 Channel-Type Waste Oil Drain Pan?</strong></p><p>We designed the "
            "65-liter mobile waste oil collection pan so you can quickly and easily collect large volumes of waste oil, "
            "coolant, brake fluid, transmission oil and power steering fluid. It is a practical solution. Thanks to the "
            "integrated wheels, you can move this oil pan with ease. In addition, the quick-coupling connection lets "
            "you complete draining quickly.</p></div> </div>"
        ),
    },
    4284: {"name": "Waste Oil Drain Pan 50 L – AYT2", "summary": None, "desc": drain_pan_desc("AYT2", 50)},
    4285: {"name": "Waste Oil Drain Pan 100 L – AYT1", "summary": None, "desc": drain_pan_desc("AYT1", 100)},
    4286: {
        "name": "Oil Drain Pan 16 L – 41960",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the AYT1 Waste Oil Drain Pan?</strong></p><p>Anti-splash lip system for easier "
            "fluid changes<br/>Carrying handle for easy transport and hose attachment capability for easy "
            "pouring</p></div> </div>"
        ),
    },
    4287: {
        "name": "Oil Drain Pan 14.25 L – 41966",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 41966 Oil Drain Pan?</strong></p><p>The 8″ – 200 mm hinged lid with "
            "leak-proof gasket safely stores waste fluids in both vertical and horizontal positions. This lid "
            "effectively prevents leaks. The product gives you flexibility in your storage area. Ergonomic carrying "
            "handles make handling easier and provide a secure grip. Durable wheels let you move the product "
            "comfortably even when full. You can easily position the product in your work area. This versatile design "
            "offers you a practical and reliable solution for waste fluid management.</p></div> </div>"
        ),
    },
    4288: {
        "name": "Drum Faucet with Gauge – 44420",
        "summary": "Aro® Compatible Spare Parts",
        "desc": ARO_DESC,
    },
    4318: {
        "name": "Pneumatic Oil Dispenser 80 L – 4600",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 4600 Pneumatic Oil Dispenser?</strong></p><p>The pneumatic oil filling unit "
            "has an 80-liter capacity. You can top up oil without an air connection. The unit is very easy to use. It "
            "works even at low air pressures. The safety relief valve on the tank provides protection against excessive "
            "air pressure. Thanks to the level gauge, you can monitor the amount of oil in the tank. It has two fixed "
            "and two swivel wheels. A funnel with a filter is fitted on top to make oil filling easier. We recommend "
            "filling the tank to four-fifths of its capacity.</p></div> </div>"
        ),
    },
    4320: {
        "name": "Pneumatic Oil Dispenser 24 L – 4620",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 4620 Pneumatic Oil Dispenser?</strong></p><p>The pneumatic oil filling unit "
            "has a 24-liter capacity. You can top up oil without an air connection. The unit is very easy to use. It "
            "works even at low air pressures. The safety relief valve on the tank provides protection against excessive "
            "air pressure. Thanks to the level gauge, you can monitor the amount of oil in the tank. It has two fixed "
            "wheels. A funnel with a filter is fitted on top to make oil filling easier. We recommend filling the tank "
            "to four-fifths of its capacity.</p></div> </div>"
        ),
    },
    4322: {
        "name": "Parts Washing Machine 80 L – 9200",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 9200 Parts Washing Machine?</strong></p><p>The air-operated parts washing "
            "unit is ideal for cleaning small disassembled engine components of vehicles and machinery, vehicle parts "
            "and machine tool parts. The cleaning basin holds 45 L and the tank capacity is 80 L. With two fixed and "
            "two swivel wheels, its mobility is excellent. The unit is very simple to use, and a water-based solvent "
            "must be used. The tank is drained with air, and the safety relief valve on the tank provides protection "
            "against excessive air pressure. This air-operated machine can be used for a limited time without a "
            "continuous air connection, as well as with the immersion method. A brush is provided for washing and an "
            "air gun for quick drying. The fluid level in the tank is monitored on the tank scale. A drain plug is "
            "provided for removing solid residues that accumulate inside the tank. It must never be used with "
            "corrosive, flammable, explosive or combustible fluids.</p></div> </div>"
        ),
    },
    4330: {
        "name": "Mobile Grease Drum System – SVS2400",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the SVS2400 Mobile Grease Drum System?</strong></p><p>The mobile grease "
            "lubrication trolley is available in many versions for different purposes. Pump options with different "
            "output and pressure ratios, hose lengths of up to 20 meters, and gram-totalizing metered guns that can be "
            "adapted to the system on request give it a very high working capability. Considering the differing needs "
            "of every business, these systems offer an excellent solution. The drum trolley is manufactured from "
            "quality sheet steel and finished with electrostatic paint; with two swivel and two fixed wheels, it is "
            "highly maneuverable. The SVS2400 grease drum system consists of 8 standard components, but you can choose "
            "your own grease pump, grease gun and grease hose length.</p></div> </div>"
        ),
    },
    4332: {
        "name": "Mobile Oil Drum System with Hose Reel – SVS4500",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the SVS4500 Mobile Oil Drum System with Hose Reel?</strong></p><p>Offered in "
            "many versions for different purposes, the mobile oil dispensing trolley delivers very high working "
            "capability thanks to pump options with different output and pressure ratios, 10, 15 and 20-meter oil hose "
            "reels, and liter-metered guns you can add according to your needs. Taking the different needs of every "
            "business into account, we offer you an excellent solution. The drum trolley, which we manufacture from "
            "quality sheet steel and finish with electrostatic paint, is highly maneuverable thanks to its two swivel "
            "and two fixed wheels. The SVS4500 oil drum system consists of four standard components; however, you can "
            "build different sets by choosing your own oil pump, oil gun and oil hose reel.</p><div> </div></div> </div>"
        ),
    },
    4333: {"name": "Mobile Oil Drum System – SVS4400", "summary": None, "desc": SVS44_DESC},
    4334: {"name": "Mobile Grease Drum System with Hose Reel – SVS2500", "summary": None, "desc": SVS44_DESC},
    4350: {
        "name": "Mechanical Metered Oil Gun – 4109",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 4109 Mechanical Metered Oil Gun?</strong></p><p>The mechanical liter-metered "
            "oil gun lets you control the dispensed oil volume even under the most demanding conditions. No calibration "
            "is required. It keeps a simple, easy-to-read, fully mechanical record. It features a five-digit totalizer "
            "display.</p><p> </p></div> </div>"
        ),
    },
    4352: {
        "name": "Heavy-Duty Metered Oil Gun – 4108",
        "summary": None,
        "desc": (
            "<div> <div><h4><strong>Why the 4108 Heavy-Duty Metered Oil Gun?</strong></h4><p>Ideal for users seeking "
            "high efficiency and time savings. A digital flow meter for all types of synthetic and mineral oils, a "
            "battery-powered digital display, and the ability to view both the oil volume of each dispense and the "
            "total volume; the metering unit delivers highly accurate results regardless of oil viscosity, ambient "
            "temperature or system pressure. The polycarbonate housing is extremely durable, and the device is "
            "long-lasting even under harsh working conditions. Its ergonomic design provides comfortable "
            "use.</p></div> </div>"
        ),
    },
    4353: {
        "name": "Preset Metered Oil Gun – 4107",
        "summary": None,
        "desc": (
            "<div> <div><p><strong>Why the 4107 Preset Metered Oil Gun?</strong></p><p>Without liter-metered guns, "
            "there is no way to measure oil volume accurately while avoiding environmental pollution and occupational "
            "safety risks. In every situation where you want to accurately determine the amount of fluid transferred "
            "or calculate the correct amount of oil to add to an engine, liter-metered guns offer you durability, ease "
            "of use and high reliability. On model 4107, once the preselected amount has been dispensed, the gun shuts "
            "off automatically and stops dispensing.</p></div> </div>"
        ),
    },
    4354: {
        "name": "Metered Oil Gun – 4106S",
        "summary": None,
        "desc": gun_4106_desc("4106S", "Oil", "The 4106S electronic metered oil gun, produced for oil,"),
    },
    4355: {
        "name": "Metered Oil Gun – 4106P",
        "summary": None,
        "desc": gun_4106_desc("4106P", "Oil", "The digital metered oil gun"),
    },
    4356: {
        "name": "Metered Antifreeze Gun – 4106A",
        "summary": None,
        "desc": gun_4106_desc("4106A", "Antifreeze", "The 4106A electronic metered antifreeze gun, produced for antifreeze,"),
    },
}


def slugify(s):
    s = s.replace("–", "-").replace("—", "-")
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def plain_text(h):
    t = re.sub(r"<[^>]+>", " ", h)
    t = htmlmod.unescape(t)
    return re.sub(r"\s+", " ", t).strip()


def meta_desc(h):
    if not h:
        return None
    t = plain_text(h)
    if len(t) <= 155:
        return t
    cut = t[:155]
    if " " in cut:
        cut = cut[: cut.rfind(" ")]
    return cut.rstrip(" ,;:.") + "…"


def q(v):
    if v is None:
        return "NULL"
    assert "$h$" not in v
    return "$h$" + v + "$h$"


def main():
    records = json.loads(INPUT.read_text(encoding="utf-8"))
    stmts = []
    for r in records:
        wp = r["wp_id"]
        tr = TR[wp]
        en_name = tr["name"]
        en_slug = slugify(en_name)
        en_sum = tr["summary"]
        en_desc = tr["desc"]
        en_usage = tr.get("usage")
        ptr_id = uuid.uuid5(NS, f"hdm-ptr-en-{wp}")
        meta_title = en_name + " | HD Marine"
        md = meta_desc(en_desc)
        stmts.append(
            "INSERT INTO product_translations (id, product_id, locale, name, slug, summary, description, "
            "usage_areas, meta_title, meta_description, translation_status) VALUES "
            f"('{ptr_id}', '{r['product_uuid']}', 'en', {q(en_name)}, {q(en_slug)}, {q(en_sum)}, {q(en_desc)}, "
            f"{q(en_usage)}, {q(meta_title)}, {q(md)}, 'auto') ON CONFLICT DO NOTHING;"
        )
        for f in r.get("faqs") or []:
            ftr = tr["faqs"][f["i"]]
            fid = uuid.uuid5(NS, f"hdm-faqtr-en-{wp}-{f['i']}")
            stmts.append(
                "INSERT INTO product_faq_translations (id, faq_id, locale, question, answer) VALUES "
                f"('{fid}', '{f['faq_uuid']}', 'en', {q(ftr['q'])}, {q(ftr['a'])}) ON CONFLICT DO NOTHING;"
            )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(stmts) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {len(stmts)} statements)")


if __name__ == "__main__":
    main()
