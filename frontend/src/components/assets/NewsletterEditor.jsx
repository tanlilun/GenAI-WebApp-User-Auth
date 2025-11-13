import React, { useState, useEffect, useCallback } from "react";
import { AssetSet } from "../../store/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Mail, Check } from "lucide-react";

export default function NewsletterEditor({ assetSet, onUpdateAssetSet }) {
  const newsletter = assetSet.newsletter || {};
  const selectedImage = assetSet.images;
  const selectedImageUrl = selectedImage?.url || "";

  const [subject, setSubject] = useState(newsletter.subject || "");
  const [headline, setHeadline] = useState(newsletter.headline || "");
  const [logoUrl, setLogoUrl] = useState(newsletter.logoUrl || "https://ev2gang.com/wp-content/uploads/2023/12/Bangkok-Insurance-logo-e1702925895954.png");
  const [caption, setCaption] = useState(newsletter.caption || "");
  const [cta, setCta] = useState(newsletter.cta || "");
  const [point1, setPoint1] = useState(newsletter.point1 || "");
  const [description1, setDescription1] = useState(newsletter.description1 || "");
  const [point2, setPoint2] = useState(newsletter.point2 || "");
  const [description2, setDescription2] = useState(newsletter.description2 || "");
  const [body, setBody] = useState(newsletter.body || "");

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showSaved, setShowSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setIsDirty(true);
  };

  useEffect(() => {
    const generatedHTML = `
    <!DOCTYPE html>
    <html>
      <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width" /></head>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 30px auto; background: #fff; padding: 20px; border-radius: 8px;">
          <h1 style="color: #333; text-align: center;">${headline || ""}</h1>

          ${
            logoUrl
              ? `<div style="text-align: center; margin: 10px 0;">
                  <img src="${logoUrl}" alt="Logo" style="max-width: 240px; height: auto;" />
                </div>`
              : ""
          }

          ${
            selectedImageUrl
              ? `<div style="text-align: center; margin: 16px 0;">
                  <img src="${selectedImageUrl}" style="max-width: 100%; border-radius: 8px;" alt="Promotional image" />
                  <div style="font-size: 14px; color: #666; text-align: center;">${caption || ""}</div>
                </div>`
              : ""
          }

          ${
            cta
              ? `<div style="text-align: center; margin: 20px 0;">
                  <a href="#" style="display: inline-block; background: #0f4495; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">${cta}</a>
                </div>`
              : ""
          }

          ${
            point1
              ? `<div style="margin-top: 20px;">
                  <h3 style="color: #0f4495; margin: 0;">${point1}</h3>
                  <p style="color: #444;">${description1 || ""}</p>
                </div>`
              : ""
          }

          ${
            point2
              ? `<div style="margin-top: 20px;">
                  <h3 style="color: #0f4495; margin: 0;">${point2}</h3>
                  <p style="color: #444;">${description2 || ""}</p>
                </div>`
              : ""
          }
        </div>
      </body>
    </html>
    `;
    setBody(generatedHTML.trim());
  }, [headline, logoUrl, selectedImageUrl, caption, cta, point1, description1, point2, description2]);

  const saveNewsletter = useCallback(async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      const updatedNewsletter = {
        subject,
        headline,
        logoUrl,
        caption,
        cta,
        point1,
        description1,
        point2,
        description2,
        body,
      };
      await AssetSet.getState().update(assetSet._id, { newsletter: updatedNewsletter });
      if (onUpdateAssetSet) {
        onUpdateAssetSet({ ...assetSet, newsletter: updatedNewsletter });
      }
      setIsDirty(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, subject, headline, logoUrl, caption, cta, point1, description1, point2, description2, body, assetSet, onUpdateAssetSet]);

  useEffect(() => {
    if (!isDirty) return;
    const timeout = setTimeout(saveNewsletter, 2000);
    return () => clearTimeout(timeout);
  }, [isDirty, saveNewsletter]);

  const copyHtml = async () => {
    try {
      const htmlContent = `Subject: ${subject}\n\n${body}`;
      await navigator.clipboard.writeText(htmlContent);
      setCopied("html");
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Failed to copy HTML:", error);
    }
  };

  const handleCopy = async (label, value) => {
    try {
      await navigator.clipboard.writeText(value || "");
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const fields = [
    { id: "subject", label: "Email Subject", value: subject, setter: setSubject },
    { id: "headline", label: "Headline", value: headline, setter: setHeadline },
    // { id: "logoUrl", label: "Logo Image URL", value: logoUrl, setter: setLogoUrl },
    { id: "caption", label: "Image Caption", value: caption, setter: setCaption },
    { id: "cta", label: "Call to Action (Button Text)", value: cta, setter: setCta },
    { id: "point1", label: "Point 1 Title", value: point1, setter: setPoint1 },
    { id: "description1", label: "Point 1 Description", value: description1, setter: setDescription1 },
    { id: "point2", label: "Point 2 Title", value: point2, setter: setPoint2 },
    { id: "description2", label: "Point 2 Description", value: description2, setter: setDescription2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-600" />
          Newsletter Content
          {showSaved && (
            <span className="text-green-600 text-sm font-medium ml-2">Saved</span>
          )}
        </h3>
        <Button variant="outline" onClick={copyHtml} disabled={!subject || !body}>
          {copied === "html" ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy HTML
            </>
          )}
        </Button>
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Email Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map(({ id, label, value, setter }) => {
              const extraLabel =
                id === "headline" ? (
                  <Label className="block text-lg font-medium mb-1 mt-4">Email Header</Label>
                ) : id === "point1" ? (
                  <Label className="block text-lg font-medium mb-1 mt-6">Email Body</Label>
                ) : null;

              return (
                <div key={id}>
                  {extraLabel}
                  <div className="flex justify-between items-center mb-1">
                    <Label htmlFor={id}>{label}</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-sm text-gray-600 hover:text-purple-600"
                      onClick={() => handleCopy(label, value)}
                    >
                      {copied === label ? (
                        <>
                          <Check className="w-4 h-4 mr-1 text-green-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    id={id}
                    value={value}
                    onChange={handleChange(setter)}
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right: Live Preview */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Live Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <iframe
              id="email-preview"
              title="email-preview"
              srcDoc={body}
              style={{
                width: "100%",
                border: "none",
                backgroundColor: "white",
              }}
              onLoad={(e) => {
                const iframe = e.target;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                  iframe.style.height = iframeDoc.body.scrollHeight + "px";
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
