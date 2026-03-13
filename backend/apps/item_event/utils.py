from apps.type_property.models import type_property
from apps.uom_base_unit.models import uom_base_unit
from apps.uom.models import uom


def get_uoms(culture, code):
    uoms = uom.objects.filter(CULTURE=culture, CODE=code).values().first()
    return uoms


def get_uoms_unit(culture, code):
    uoms = uom_base_unit.objects.filter(CULTURE=culture, CODE=code).values().first()
    return uoms


def transform_uom_by_type(data, culture, is_unit=False):
    # print(data)
    prop = type_property.objects.filter(
        TYPE=data["EVENT_TYPE"], UOM__isnull=False
    ).values("UOM", "COLUMN_NAME", "DECIMALS")
    # (A + (BX)) / (C + (DX))
    try:
        if prop:
            for column in prop:
                if data[column["COLUMN_NAME"]] is None:
                    continue
                uoms = get_uoms(culture, column["UOM"])
                # if uoms is None:
                #     uoms = get_uoms_unit(culture, column["UOM"])
                # print(uoms)
                if uoms:
                    transform_data = None  # Varsa varsayılan değeri belirle
                    if (
                        uoms
                        and "A" in uoms
                        and "B" in uoms
                        and "C" in uoms
                        and "D" in uoms
                    ):
                        if (
                            "," in list(uoms["B"])
                            or "," in list(uoms["C"])
                            or "," in list(uoms["D"])
                            or "," in list(data[column["COLUMN_NAME"]])
                        ):
                            uoms["A"] = uoms["A"].replace(",", ".")
                            uoms["B"] = uoms["B"].replace(",", ".")
                            uoms["C"] = uoms["C"].replace(",", ".")
                            uoms["D"] = uoms["D"].replace(",", ".")
                            data[column["COLUMN_NAME"]] = data[
                                column["COLUMN_NAME"]
                            ].replace(",", ".")

                        denominator = float(uoms["B"]) - (
                            float(uoms["D"]) * float(data[column["COLUMN_NAME"]])
                        )

                        if denominator != 0:
                            numerator = (
                                (float(uoms["C"])) * float(data[column["COLUMN_NAME"]])
                            ) - float(uoms["A"])

                            transform_data = numerator / denominator

                            decimal_places = column["DECIMALS"]
                            if decimal_places is None:
                                formatted_number = transform_data
                            else:
                                decimal_places = int(decimal_places)
                                formatted_number = (
                                    f"{float(transform_data):.{decimal_places}f}"
                                )

                            data[column["COLUMN_NAME"]] = formatted_number
                        # print("A + BX = ",denominator,"   C + DX = ",numerator,"  RESULT= ",formatted_number," COLUMN =",column["COLUMN_NAME"])
    except Exception as e:
        print(e)

        # print('BU HATALI \n ')
        # print(e)
        # print(column["COLUMN_NAME"])
    return data


def retransform_uom_by_type(data, culture, is_unit=False):
    prop = type_property.objects.filter(
        TYPE=data["EVENT_TYPE"], UOM__isnull=False
    ).values("UOM", "COLUMN_NAME", "DECIMALS")
    # (A + (BX)) / (C + (DX))
    # print(prop)
    try:
        if prop:
            for column in prop:
                if data[column["COLUMN_NAME"]] is None:
                    continue
                uoms = get_uoms(culture, column["UOM"])
                if uoms:
                    transform_data = None  # Varsa varsayılan değeri belirle
                    if (
                        uoms
                        and "A" in uoms
                        and "B" in uoms
                        and "C" in uoms
                        and "D" in uoms
                    ):
                        if (
                            "," in list(uoms["B"])
                            or "," in list(uoms["C"])
                            or "," in list(uoms["D"])
                            or "," in list(data[column["COLUMN_NAME"]])
                        ):
                            uoms["A"] = uoms["A"].replace(",", ".")
                            uoms["B"] = uoms["B"].replace(",", ".")
                            uoms["C"] = uoms["C"].replace(",", ".")
                            uoms["D"] = uoms["D"].replace(",", ".")
                            data[column["COLUMN_NAME"]] = data[
                                column["COLUMN_NAME"]
                            ].replace(",", ".")

                        denominator = float(uoms["C"]) + (
                            float(uoms["D"]) * float(data[column["COLUMN_NAME"]])
                        )

                        if denominator != 0:
                            numerator = float(uoms["A"]) + (
                                (float(uoms["B"])) * float(data[column["COLUMN_NAME"]])
                            )
                            transform_data = numerator / denominator

                            decimal_places = column["DECIMALS"]
                            if decimal_places is None:
                                formatted_number = transform_data
                            else:
                                decimal_places = int(decimal_places)
                                formatted_number = (
                                    f"{float(transform_data):.{decimal_places}f}"
                                )

                            data[column["COLUMN_NAME"]] = formatted_number
                        # print("A + BX = ",denominator,"   C + DX = ",numerator,"  RESULT= ",formatted_number," COLUMN =",column["COLUMN_NAME"])
    except Exception as e:
        pass
        # print(e)

        # print('BU HATALI \n ')
        # print(e)
        # print(column["COLUMN_NAME"])
    return data


def status_transform_uom(data, culture, is_unit=False):
    prop = type_property.objects.filter(
        TYPE=data["EVENT_TYPE"], UOM__isnull=False
    ).values("UOM", "COLUMN_NAME", "DECIMALS")
    # (A + (BX)) / (C + (DX))
    # print(prop)
    print(data["VAL1"])
    try:
        if prop:
            for column in prop:
                try:
                    print(data[column["COLUMN_NAME"]])
                except:
                    continue
                uoms = get_uoms(culture, column["UOM"])
                if uoms:
                    transform_data = None  # Varsa varsayılan değeri belirle
                    if (
                        uoms
                        and "A" in uoms
                        and "B" in uoms
                        and "C" in uoms
                        and "D" in uoms
                    ):
                        if (
                            "," in list(uoms["B"])
                            or "," in list(uoms["C"])
                            or "," in list(uoms["D"])
                            or "," in list(data[column["COLUMN_NAME"]])
                        ):
                            uoms["A"] = uoms["A"].replace(",", ".")
                            uoms["B"] = uoms["B"].replace(",", ".")
                            uoms["C"] = uoms["C"].replace(",", ".")
                            uoms["D"] = uoms["D"].replace(",", ".")
                            data[column["COLUMN_NAME"]] = data[
                                column["COLUMN_NAME"]
                            ].replace(",", ".")

                        denominator = float(uoms["C"]) + (
                            float(uoms["D"]) * float(data[column["COLUMN_NAME"]])
                        )

                        if denominator != 0:
                            numerator = float(uoms["A"]) + (
                                (float(uoms["B"])) * float(data[column["COLUMN_NAME"]])
                            )
                            transform_data = numerator / denominator

                            decimal_places = column["DECIMALS"]
                            if decimal_places is None:
                                formatted_number = transform_data
                            else:
                                decimal_places = int(decimal_places)
                                formatted_number = (
                                    f"{float(transform_data):.{decimal_places}f}"
                                )

                            data[column["COLUMN_NAME"]] = formatted_number
                        # print("A + BX = ",denominator,"   C + DX = ",numerator,"  RESULT= ",formatted_number," COLUMN =",column["COLUMN_NAME"])
    except Exception as e:
        pass
        # print(e)

        # print('BU HATALI \n ')
        # print(e)
        # print(column["COLUMN_NAME"])
    return data
