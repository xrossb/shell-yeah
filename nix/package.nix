{...}: {
  perSystem = {
    inputs',
    pkgs,
    ...
  }: let
    astalPackages = with inputs'.astal.packages; [
      astal4
      apps
      auth
      battery
      bluetooth
      io
      mpris
      network
      notifd
      tray
      wireplumber
      inputs'.astal-niri.packages.niri
    ];
    jetbrains-mono = pkgs.nerd-fonts.jetbrains-mono;
  in {
    packages.default = pkgs.stdenv.mkDerivation rec {
      name = "shell-yeah";
      src = ../.;
      entrypoint = "app.ts";

      nativeBuildInputs = with pkgs; [
        gobject-introspection
        makeWrapper
        wrapGAppsHook4
        inputs'.ags.packages.default
      ];

      buildInputs = with pkgs;
        astalPackages
        ++ [
          glib
          gjs
          libadwaita
        ];

      installPhase = ''
        mkdir -p $out/share/fonts
        cp -r ${jetbrains-mono}/share/fonts/* $out/share/fonts
        cp -r ${pkgs.material-symbols}/share/fonts/* $out/share/fonts
        mkdir -p $out/bin
        mkdir -p $out/share/${name}
        cp -r assets/* $out/share/${name}
        ags bundle ${entrypoint} $out/bin/${name} -d "DATADIR='$out/share/${name}'"
      '';
    };
  };
}
