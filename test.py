def validate_file(base64String : str):
    try:
        if base64String.split(";")[0][:10] == "data:image":
            base64String = base64String.split(";")[1]
            size = (len(base64String) * 3) / 4 - base64String.count("=")
            size /= 1000000
            if (size <= 10):
                return True
        return False
    except:
        return False


example = ""


print(validate_file(example))

