
from flask import Flask, render_template, request, send_file, jsonify
from PIL import Image
from io import BytesIO
import re
from urllib.parse import urlparse

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/inspect-metadata", methods=["POST"])
def inspect_metadata():
    uploaded_file = request.files.get("image")

    if not uploaded_file or not uploaded_file.filename:
        return jsonify({"error": "Please select an image first."}), 400

    try:
        image_data = uploaded_file.read()
        image = Image.open(BytesIO(image_data))

        if image.format != "JPEG":
            return jsonify({
                "error": "Currently, only JPEG images are supported."
            }), 400

        metadata = image.getexif()
        metadata_details = {}

        for tag_id, value in metadata.items():
            tag_name = Image.ExifTags.TAGS.get(tag_id, str(tag_id))
            metadata_details[tag_name] = str(value)

        return jsonify({
            "filename": uploaded_file.filename,
            "format": image.format,
            "metadata": metadata_details,
            "metadata_count": len(metadata_details)
        })

    except Exception:
        return jsonify({
            "error": "Could not read this image. Please try another JPEG file."
        }), 400


@app.route("/scrub-metadata", methods=["POST"])
def scrub_metadata():
    uploaded_file = request.files.get("image")

    if not uploaded_file or not uploaded_file.filename:
        return jsonify({"error": "Please select an image first."}), 400

    try:
        image_data = uploaded_file.read()
        image = Image.open(BytesIO(image_data))

        if image.format != "JPEG":
            return jsonify({
                "error": "Currently, only JPEG images are supported."
            }), 400

        # Re-encode the image without copying its EXIF metadata.
        cleaned_image = Image.new(image.mode, image.size)
        cleaned_image.putdata(list(image.getdata()))

        output = BytesIO()
        cleaned_image.save(output, format="JPEG", quality=95)
        output.seek(0)

        return send_file(
            output,
            mimetype="image/jpeg",
            as_attachment=True,
            download_name="cleaned_image.jpg"
        )

    except Exception:
        return jsonify({
            "error": "Could not clean this image. Please try another JPEG file."
        }), 400

@app.route("/check-phishing", methods=["POST"])
def check_phishing():
    data = request.get_json(silent=True) or {}
    url = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "Please enter a URL."}), 400

    # Add a scheme when the user enters a domain without one.
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*://", url):
        url = "https://" + url

    try:
        parsed_url = urlparse(url)
        hostname = parsed_url.hostname or ""
    except ValueError:
        return jsonify({"error": "Please enter a valid URL."}), 400

    if parsed_url.scheme not in ("http", "https") or not hostname:
        return jsonify({
            "error": "Please enter a valid HTTP or HTTPS URL."
        }), 400

    if "." not in hostname and hostname != "localhost":
        return jsonify({
            "error": "Please enter a valid website address, such as example.com."
        }), 400

    if " " in hostname:
        return jsonify({
            "error": "Website addresses cannot contain spaces."
        }), 400
    
    risks = []

    if "@" in parsed_url.netloc:
        risks.append("The URL contains an @ symbol, which can hide the actual destination.")

    if re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", hostname):
        risks.append("The URL uses an IP address instead of a regular domain name.")

    shorteners = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly")
    if hostname.lower() in shorteners:
        risks.append("This is a URL shortener, so the final destination is not obvious.")

    if parsed_url.scheme == "http":
        risks.append("The URL does not use HTTPS.")

    if hostname.lower().startswith("xn--") or ".xn--" in hostname.lower():
        risks.append("The domain uses encoded characters that may resemble other characters.")

    if len(url) > 150:
        risks.append("The URL is unusually long.")

    if risks:
        risk_level = "Suspicious" if len(risks) < 3 else "High Risk"
    else:
        risk_level = "Low Risk"

    return jsonify({
        "url": url,
        "risk_level": risk_level,
        "risk_count": len(risks),
        "warnings": risks,
        "message": (
            "This check identifies suspicious URL patterns only. "
            "A low-risk result does not guarantee that a website is safe."
        )
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
