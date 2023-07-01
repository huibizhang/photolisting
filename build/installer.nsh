;install
!macro customInstall
   WriteRegExpandStr HKCU "Software\Classes\Directory\shell\Photolisting" "" "以 Photolisting 中開啟"
   WriteRegExpandStr HKCU "Software\Classes\Directory\shell\Photolisting" "Icon" "$INSTDIR\photolisting.exe"
   WriteRegExpandStr HKCU "Software\Classes\Directory\shell\Photolisting\command" "" '"$INSTDIR\photolisting.exe" "%V"'

   WriteRegExpandStr HKCU "Software\Classes\Directory\Background\shell\Photolisting" "" "以 Photolisting 中開啟"
   WriteRegExpandStr HKCU "Software\Classes\Directory\Background\shell\Photolisting" "Icon" "$INSTDIR\photolisting.exe"
   WriteRegExpandStr HKCU "Software\Classes\Directory\Background\shell\Photolisting\command" "" '"$INSTDIR\photolisting.exe" "%V"'
   
!macroend

;uninstall
!macro customUninstall
   DeleteRegKey HKCU "Software\Classes\Directory\shell\Photolisting"
   DeleteRegKey HKCU "Software\Classes\Directory\Background\shell\Photolisting"
!macroend